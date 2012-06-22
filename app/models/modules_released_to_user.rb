class ModulesReleasedToUser < ActiveRecord::Base

	belongs_to :content_tag
	belongs_to :user
end
