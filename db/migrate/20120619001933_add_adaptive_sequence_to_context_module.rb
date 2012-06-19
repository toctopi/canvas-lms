class AddAdaptiveSequenceToContextModule < ActiveRecord::Migration
	tag :predeploy

  def self.up
  	add_column :context_modules, :adaptive_sequence, :boolean
  end

  def self.down
  	remove_column :context_modules, :adaptive_sequence
  end
end
