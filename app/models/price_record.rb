# frozen_string_literal: true

require 'expiration_calculator'

class PriceRecord < ApplicationRecord
  Friend = Struct.new(:island, :resident)

  validates :island, :resident, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :timezone, presence: true, format: { with: /\A[+-]\d{2}:\d{2}\z/ }
  validate :validate_time, on: :create
  validates :text, length: { maximum: 255 }

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
  end

  def expiration
    ExpirationCalculator.end(updated_at.localtime(timezone))
  end

  def expired?(now: Time.now)
    now >= expiration
  end

  def validate_time
    if created_at && timezone && ExpirationCalculator.interval(created_at.localtime(timezone)).include?(created_at)
      return
    end

    errors.add(:base, 'invalid creation time')
  end
end
