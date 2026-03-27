Table user{
  id integer [primary key]
  name VARCHAR(255)
  last_name VARCHAR(255)
  email VARCHAR(255) [unique, not null]
  password_hashed VARCHAR(255) [not null] 
}