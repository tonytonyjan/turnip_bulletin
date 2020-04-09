class CreatePriceRecords < ActiveRecord::Migration[6.0]
  def change
    create_table :price_records do |t|
      t.string :island
      t.string :resident
      t.integer :price
      t.timestamps
      t.index %i[island resident]
    end
  end
end
