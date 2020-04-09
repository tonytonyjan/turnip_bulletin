class AddTimezoneToPriceRecords < ActiveRecord::Migration[6.0]
  def change
    add_column :price_records, :timezone, :string
  end
end
