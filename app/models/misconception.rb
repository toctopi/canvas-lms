class Misconception < ActiveRecord::Base
	has_many :misconception_items
	belongs_to :quiz, :touch => true
	belongs_to :context, :polymorphic => true
end
