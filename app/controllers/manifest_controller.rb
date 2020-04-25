# frozen_string_literal: true

class ManifestController < ApplicationController
  def manifest
    render content_type: 'application/manifest+json',
           json: {
             name: '動森股友會',
             short_name: '動森股友會',
             start_url: '/',
             display: 'standalone',
             background_color: '#ab47bc',
             theme_color: '#ab47bc',
             description: '「動森股友會」是一款能讓動物森友會玩家們即時分享大頭菜價的應用，比起一個人預測大頭菜走向，不如多一點菜友，大家一起發大財。',
             icons: [
               {
                 src: helpers.asset_pack_path('media/images/turnip192.png'),
                 sizes: '192x192'
               },
               {
                 src: helpers.asset_pack_path('media/images/turnip512.png'),
                 sizes: '512x512'
               }
             ]
           }
  end
end
