class CreateTableStructure < ActiveRecord::Migration[8.1]
  def change
    create_table :maps do |t|
      t.string :name

      t.timestamps
    end

    create_table :findables do |t|
      t.string :name
      t.string :type_of

      t.timestamps
    end

    create_table :coordinates, id: false do |t|
      t.float :x
      t.float :y
      t.references :map, index: true
      t.references :findable, index: true
    end

    create_table :users do |t|
      t.string :name
      t.index :name, unique: true
      t.string :token

      t.timestamps
    end

    create_table :scores do |t|
      t.float :value
      t.references :map, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    create_table :findables_maps, id: false do |t|
      t.references :findable, index: true
      t.references :map, index: true
    end
  end
end
