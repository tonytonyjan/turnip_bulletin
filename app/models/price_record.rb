# frozen_string_literal: true

require 'expiration_calculator'

class PriceRecord < ApplicationRecord
  SECONDS_1_WEEK = 604_800

  Friend = Struct.new(:island, :resident)

  validates :island, :resident, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :timezone, presence: true, inclusion: { in: TZInfo::Timezone.all_identifiers }
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

  def self.expired(now: Time.now)
    where('updated_at < ?', now - SECONDS_1_WEEK)
  end

  def expiration
    ExpirationCalculator.end(updated_at.in_time_zone(timezone).to_time)
  end

  def expired?(now: Time.now)
    now >= expiration
  end

  def validate_time
    if created_at && timezone && ExpirationCalculator.interval(created_at.in_time_zone(timezone).to_time).include?(created_at)
      return
    end

    errors.add(:base, 'invalid creation time')
  end
end
