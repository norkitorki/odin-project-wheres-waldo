User.destroy_all
Coordinate.delete_all
Findable.destroy_all
Map.destroy_all

begin
  key = "PyL79xWPl8Jr1c8X709oepQFfJ2ULZiQNVqKoxFojBEtJ3gb7d2EQq2sGbrfjAtC2BmnlQlbqMQf9riQGThvuwkaU1dbdRoXLdFeDuupbxgo5Y28d5nspAhRbcKmlj6e"
  data = SecretKeys.new("db/seeds/data.yaml", key)
rescue
  puts "Unable to find secret key or to decrypt data.yaml"
  return
end

MAPS = data["maps"].freeze

def create_or_assign_findables(map, type, collection = [])
  collection.each do |findable|
    new_findable = Findable.find_or_create_by!(name: findable["name"], type_of: type)
    if new_findable
      map.findables << new_findable
      Coordinate.create!(findable: new_findable, map: map, x: findable["x"], y: findable["y"])
    end
  end
end

puts "Importing application data..."

User.new(name: 'Anon').save(validate: false)

MAPS.each do |map|
  new_map = Map.create!(name: map["name"])
  if new_map
    create_or_assign_findables(new_map, :character, map["characters"])
    create_or_assign_findables(new_map, :item, map["items"])
    puts "  #{new_map.name} data imported."
  end
end

puts "Import complete."
