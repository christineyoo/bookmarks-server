-- First, remove the table if it exists
drop table if exists bookmarks;

-- Create the table anew
create table bookmarks (
    id INTEGER primary key generated by default as identity,
    b_title TEXT NOT NULL,
    b_url TEXT NOT NULL,
    b_description TEXT NOT NULL,
    b_rating INTEGER DEFAULT 1
);

-- insert some test data
-- Using a multi-row insert statement here
insert into bookmarks (b_title, b_url, b_description, b_rating)
values
('Google', 'www.google.com', 'Where you can search for anything', 5),
('Thinkful', 'www.thinkful.com', 'Where you can learn about coding', 4),
('YouTube', 'www.youtube.com', 'Where you can watch anything', 3),
('Canvas', 'www.canvas.com', 'Where you can learn school subjects'),
('DeltaMath', 'www.deltamath.com', 'Where you can practice math skills'),
('Amazon', 'www.amazon.com', 'Where you can buy anything', 1),
('Facebook', 'www.facebook.com', 'Where you can social network', 3),
('Instagram', 'www.instagram.com', 'Where you can see pictures', 2),
('Netflix', 'www.netflix.com', 'Where you stream movies and shows', 4),
('Disney+', 'www.disneyplus.com', 'Where you can stream anything Disney');
