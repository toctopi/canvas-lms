class ModulesReleasedToUser < ActiveRecord::Base
	belongs_to :context, :polymorphic => true
	belongs_to :content_tag
	belongs_to :user

  named_scope :active, lambda{
    {:conditions => ['modules_released_to_users.workflow_state != ?', 'deleted'] }
  }

  def released=(rel)
  	write_attribute(:released, rel)
  end

  def released
  	read_attribute(:released)
  end

end
