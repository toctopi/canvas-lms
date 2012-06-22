class CreateModulesReleasedToUsers < ActiveRecord::Migration
  tag :predeploy
  
  def self.up
    create_table :modules_released_to_users do |t|
      t.integer :content_tag_id, :limit => 8
      t.integer :user_id, :limit => 8
      t.boolean :released
      t.integer :context_id, :limit => 8
      t.string :context_type
      t.integer :workflow_state

      t.timestamps
    end

    add_index :modules_released_to_users, :content_tag_id
    add_index :modules_released_to_users, :user_id
    add_index :modules_released_to_users, :context_id
  end

  def self.down
    remove_index :modules_released_to_users, :content_tag_id
    remove_index :modules_released_to_users, :user_id
    remove_index :modules_released_to_users, :context_id
    drop_table :modules_released_to_users
  end
end
