# frozen_string_literal: true

require 'sinatra'
require 'sinatra/json'
require 'sinatra/cross_origin'
# By default Sinatra will return the string as the response.

module App
  class Site < Sinatra::Base
    set :bind, '0.0.0.0'
    set :static, true

    configure do
      enable :cross_origin
    end

    before do
      response.headers['Access-Control-Allow-Origin'] = '*'
    end

    def meta(title:)
      {
        "$schema": 'http://json-schema.org/draft-07/schema#',
        "$id": "./#{title}.json",
        "title": 'title.capitalize',
        "description": 'A script editor entity.',
        "type": 'object'
      }
    end

    get '/vt_insert.json' do
      json(
        meta(title: 'vt_insert').merge({
          "required": %w[title description],
          "properties": {
            "title": {
              "type": 'string',
              "description": 'The title of Vt insert'
            },
            "description": {
              "type": 'string',
              "description": 'Additional camera shot information'
            }
          }
        })
      )

    end

    get '/camera_shot.json' do
      json(
        meta(title: 'camera_shot').merge({
          "required": %w[title description],
          "properties": {
            "title": {
              "type": 'string',
              "description": 'The title of the camera shot'
            },
            "description": {
              "type": 'string',
              "description": 'Additional camera shot information'
            }
          }
        })
      )
    end
  end
end
