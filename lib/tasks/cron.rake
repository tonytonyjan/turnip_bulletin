# frozen_string_literal: true

namespace :cron do
  task delete_all_expired_records: :environment do
    puts 'Deleting expired records...'
    count = PriceRecord.expired.delete_all
    puts "#{count} records has been deleted"
  end
end
