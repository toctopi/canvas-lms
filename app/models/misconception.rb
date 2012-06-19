class Misconception < ActiveRecord::Base
	has_many :misconception_items
	belongs_to :quiz
end
