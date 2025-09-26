-- Script to list all tables in the public schema
SELECT 
    table_name,
    table_type,
    obj_description(('"' || table_schema || '"."' || table_name || '"')::regclass, 'pg_class') as description
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;
