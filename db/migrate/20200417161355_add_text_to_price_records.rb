class AddTextToPriceRecords < ActiveRecord::Migration[6.0]
  def change
    add_column :price_records, :text, :string
  end
end
