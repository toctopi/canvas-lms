class AddSecondaryCodeToMisconceptions < ActiveRecord::Migration
	tag :predeploy
	
  def self.up
  	add_column :misconceptions, :secondary_code, :string, :limit => 2048
  end

  def self.down
  	remove_column :misconceptions, :secondary_code
  end
end
