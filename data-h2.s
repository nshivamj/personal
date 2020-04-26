SET @created_by = 'shivam';
SET @last_updated_by = 'shivam';
SET @created_date_utc = CURRENT_TIMESTAMP();
SET @in_z = CURRENT_TIMESTAMP();
SET @version_type=0;
SET @version_end_id=null;
SET @out_z=null;
SET @version_id=1;

call next value for hibernate_sequence;

INSERT INTO user_rev_entity (timestamp, id) values (@created_date_utc,1);

--  RISK_DRIVER
INSERT INTO risk_driver
    (id, created_date_utc, created_by, in_z, last_updated_by, name)
    values
           (1,@created_date_utc, @created_by, @in_z , @last_updated_by, 'INDIA'),
           (2,@created_date_utc, @created_by, @in_z , @last_updated_by, 'INDIA2');

INSERT INTO RISK_DRIVER_ALL
    (version_type, version_end_id, out_z,version_id,id, created_date_utc, created_by, in_z, last_updated_by, name)
    select @version_type, @version_end_id, @out_z, @version_id, * from RISK_DRIVER;

--  RISK_CATEGORY
INSERT INTO risk_category
    (id, created_date_utc, created_by, in_z, last_updated_by, description, name, owner, status)
    values
           (1, @created_date_utc, @created_by, @in_z , @last_updated_by, 'string', 'string', 'string',0);

insert into risk_category_all
(version_type, version_end_id, out_z, version_id, id, created_date_utc, created_by, in_z, last_updated_by, description, name, owner, status)
select @version_type, @version_end_id, @out_z, @version_id, * from risk_category;

--  RISK_CRITERIA
insert
into
    risk_criteria
(id, created_date_utc, created_by, in_z, last_updated_by, description, name, type)
values
(1, @created_date_utc, @created_by, @in_z , @last_updated_by, 'ads', 'sfds', 0);

insert
into
    risk_criteria_all
(version_type, version_end_id, out_z, version_id,id, created_date_utc, created_by, in_z, last_updated_by, description, name, type)
select @version_type, @version_end_id, @out_z, @version_id, * from risk_criteria;


--  RISK_CATEGORY_CRITERIA
-- insert into
--             risk_category_criteria
--             (id, created_date_utc, created_by, in_z, last_updated_by, rating, risk_category_id, risk_criteria_id)
-- values
-- (1, @created_date_utc, @created_by, @in_z , @last_updated_by, 0, 1, 1);
--
--
-- insert
-- into
--     risk_category_criteria_all
-- (version_type, version_end_id, out_z, version_id, id, created_date_utc, created_by, in_z, last_updated_by, rating, risk_category_id, risk_criteria_id)
-- select @version_type, @version_end_id, @out_z, @version_id, * from risk_category_criteria;
