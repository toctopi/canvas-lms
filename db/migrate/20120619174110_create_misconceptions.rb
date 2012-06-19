class CreateMisconceptions < ActiveRecord::Migration
  tag :predeploy
  
  def self.up
    create_table :misconceptions do |t|
      t.string :name, :limit => 2048
      t.string :pattern, :limit => 2048
      t.string :paths, :limit => 2048

      t.timestamps
    end
  end

  def self.down
    drop_table :misconceptions
  end
end
