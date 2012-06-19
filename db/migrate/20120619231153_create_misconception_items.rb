class CreateMisconceptionItems < ActiveRecord::Migration
  tag :predeploy

  def self.up
    create_table :misconception_items do |t|
      t.integer :misconception_id, :limit => 8
      t.string :name, :limit => 2048
      t.string :pattern, :limit => 2048
      t.string :paths, :limit => 2048

      t.timestamps
    end

    add_index :misconception_items, :misconception_id
  end

  def self.down
    remove_index :misconception_items, :misconception_id
    drop_table :misconception_items
  end
end
