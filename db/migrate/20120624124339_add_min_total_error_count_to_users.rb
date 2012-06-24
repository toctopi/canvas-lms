class AddMinTotalErrorCountToUsers < ActiveRecord::Migration
	tag :predeploy

  def self.up
  	add_column :users, :min_total_error_count, :string, :limit => 2048
  end

  def self.down
  	remove_column :users, :min_total_error_count
  end
end
