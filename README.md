# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version 3.3
* Angular version 17

* Database 
    configuration for different environments is done using .env file which has 

    To initialize db just run rake db:create
    To Migrate run rake db:migrate

    OR

    bin/rails db:create
    bin/rails db:migrate

* How to run the test suite

    Ruby
        For testing of the models FactoryBot and shoulda-matchers is used.
        
        Just run bundle exec rspec spec/models  (for all models)
        
        For specific model
        eg.  bundle exec rspec spec/models/stable_spec.rb

        same for controllers i have uses request Specs

        eg. bundle exec rspec spec/requests/stables_spec.rb

        To Run all the tests run this command - bundle exec rspec 

    Angular 
        just use ng test

* Deployment instructions

    For Deployment the Docker is used, Dockerfile for this app is at the root of this directory. 
    
    Just run docker build . (. here is execute from currect directory)

    For ruby and for angular DockerFile is uesd to build the images.

    to deploy the angular on production use the commented production code in Dockerfile and yml file at root,  and update the docker-composer.yml for production. 

    At the root there exist an .env and docker-compose.yml which spins up whole stack on docker containers

    Just run docker-compose up --build
    or 
    docker-compose build && docker-compose up

    To check containers status use docker ps

    if containers have not started use docker start {container_id}
    eg. docker start abc123def456

    The .env file at the root will be used for docker-composer.yml

    Similaary

* API Documentation

    Access the Api documentation for this ruby on rails -api mode application on this link: https://documenter.getpostman.com/view/30127780/2sA3kUFhDX
