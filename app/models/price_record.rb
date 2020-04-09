# frozen_string_literal: true

class PriceRecord < ApplicationRecord
  SECONDS_10_HOURS = 36_000
  Friend = Struct.new(:island, :resident)

  def self.search_by_friends_order_by_price(friends)
    where(
      Arel::Nodes::In.new(
        Arel::Nodes::Grouping.new(
          [
            PriceRecord.arel_table[:island],
            PriceRecord.arel_table[:resident]
          ]
        ),
        friends.map do |friend|
          Arel::Nodes::Grouping.new(
            [
              Arel::Nodes.build_quoted(friend.island),
              Arel::Nodes.build_quoted(friend.resident)
            ]
          )
        end
      )
    )
      .where('created_at > ?', Time.now - SECONDS_10_HOURS)
      .order(price: :desc)
  end
end
