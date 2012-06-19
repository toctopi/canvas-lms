class CreateMisconceptions < ActiveRecord::Migration
	tag :predeploy

  def self.up
    create_table :misconceptions do |t|
      t.integer :quiz_id, :limit => 8

      t.timestamps
    end

    add_index :misconceptions, :quiz_id
  end

  def self.down
  	remove_index :misconceptions, :quiz_id
    drop_table :misconceptions
  end
end
