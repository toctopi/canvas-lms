class Misconception < ActiveRecord::Base
	belongs_to :quiz, :touch => true
	belongs_to :context, :polymorphic => true

	named_scope :active, lambda {
    {:conditions => ['misconceptions.workflow_state != ?', 'deleted'] }
  }

	def pattern=(hash)
		write_attribute(:pattern, hash.to_json)
	end

	def pattern
		JSON.parse(read_attribute(:pattern))
	end

	def paths=(hash)
		write_attribute(:paths, hash.to_json)
	end

	def paths
		JSON.parse(read_attribute(:paths))
	end

end
