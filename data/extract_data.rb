require 'pdf-reader'
require 'csv'
require 'countries'

reader = PDF::Reader.new('Global-List-AUG_25.pdf')

VALID_COUNTRY_CODES = ISO3166::Country.all.map(&:alpha3).freeze

nationality_count = reader.pages.flat_map { |p| p.text.scan(/\b[A-Z]{3}\b/) }
                          .select { |code| VALID_COUNTRY_CODES.include?(code) }
                          .tally

CSV.open('occurrence_per_nationality.csv', 'w', headers: %w[country_name country_code continent count],
                                                write_headers: true) do |csv|
  nationality_count.each do |country_code, count|
    country = ISO3166::Country.find_country_by_alpha3(country_code)
    country_name = country.common_name
    continent = country.continent
    csv << [country_name, country_code, continent, count]
  end
end
