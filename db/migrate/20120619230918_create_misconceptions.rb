class CreateMisconceptions < ActiveRecord::Migration
	tag :predeploy

  def self.up
    create_table :misconceptions do |t|
      t.integer :quiz_id, :limit => 8
      t.integer :context_id, :limit => 8
      t.string :context_type

      t.timestamps
    end

    add_index :misconceptions, :quiz_id
    add_index :misconceptions, :context_id
  end

  def self.down
    remove_index :misconceptions, :context_id
  	remove_index :misconceptions, :quiz_id
    drop_table :misconceptions
  end
end
