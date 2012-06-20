class CreateMisconceptionItems < ActiveRecord::Migration
  tag :predeploy

  def self.up
    create_table :misconception_items do |t|
      t.integer :misconception_id, :limit => 8
      t.string :name, :limit => 2048
      t.string :pattern, :limit => 2048
      t.string :paths, :limit => 2048
      t.integer :context_id, :limit => 8
      t.string :context_type

      t.timestamps
    end

    add_index :misconception_items, :misconception_id
    add_index :misconception_items, :context_id
  end

  def self.down
    remove_index :misconception_items, :context_id
    remove_index :misconception_items, :misconception_id
    drop_table :misconception_items
  end
end
