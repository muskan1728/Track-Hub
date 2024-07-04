from flask_server.models.Tag import Tag, TagCondition
from flask_server.models.Trigger import TriggerCondition, Trigger
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func, literal_column
from sqlalchemy.orm import aliased, contains_eager
from sqlalchemy import func, cast, types



class TagDao:
    def __init__(self, db):
        self.db = db

    def __addtenantt(self, query, tenant_name):
        return query.where(Tag.tenant_name == tenant_name)

    def get_all_tag(self, tenant_name=None):
        # .with_entities(Tag.id, Tag.name, Tag.type , Tag.created_at)
        query = self.db.session.query(Tag)
        if (tenant_name):
            query = self.__addtenantt(query, tenant_name)
        return query.all()

    def add_tag(self, name, type, trigger_ids, tenant_name, user_id):
        trigger_ids = [int(id) for id in trigger_ids]
        tag = Tag(name=name, type=type, trigger_id=trigger_ids,
                  tenant_name=tenant_name, user_id=user_id)
        self.db.session.add(tag)
        self.db.session.commit()
        return tag

    def get_tag_condition(self, tenant_name=None):
        if (tenant_name):
            query = (
                self.db.session
                .query(TriggerCondition, Tag)
                .join(Tag, TriggerCondition.trigger_id == Tag.trigger_id).where(Tag.tenant_name == tenant_name))
            return query.all()

        query = (
            self.db.session
            .query(TriggerCondition, Tag)
            .join(Tag, TriggerCondition.trigger_id == Tag.trigger_id)
        )
        return query.all()

    def get_tag_trigger_type(self, tenant_name=None):
        query = (
            self.db.session
            .query(Trigger, Tag)
            .join(Tag, Trigger.id == Tag.trigger_id)
        )
        if (tenant_name):
            query = self.__addtenantt(query, tenant_name)
        return query.all()

    def get_tag_details(self, user_id=None):
       
        TagAlias = aliased(Tag)

        # Subquery to unnest the trigger_id JSON array
        
        # Join query
        query = (
    self.db.session.query(Trigger, Tag,TriggerCondition)
    .select_from(Trigger)
    .outerjoin(TriggerCondition, Trigger.id == TriggerCondition.trigger_id)
    .join(Tag, func.json_contains(Tag.trigger_id, cast(Trigger.id, types.JSON)), isouter=True)

)


        # # Execute the query
        # results = joined_query.all()
        #         #  .outerjoin(TriggerCondition, Tag.trigger_id.contains(TriggerCondition.trigger_id)))
        # print(results,"---------------------aa")
        # query = (self.db.session
        #          .query(Trigger, Tag, TriggerCondition)
        #          .join(Tag, Tag.trigger_id.contains(Trigger.id), isouter=False)
        #          .outerjoin(TriggerCondition, Tag.trigger_id.contains(TriggerCondition.trigger_id)))

        if(user_id):
         query=   query.where(Tag.user_id == user_id)
        return query.all()
