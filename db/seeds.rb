data_file = ENV["MAP_SEEDS_DATA"]
return puts "Please point MAP_SEEDS_DATA variable to an existing .yaml file." unless data_file && File.exist?(data_file)

MAPS = YAML.safe_load_file(data_file)["maps"]

User.destroy_all
Coordinate.delete_all
Findable.destroy_all
Map.destroy_all

def create_or_assign_findables(map, type, collection = [])
  collection.each do |findable|
    new_findable = Findable.find_or_create_by(name: findable["name"], type_of: type)
    map.findables << new_findable
    Coordinate.create(x: findable["x"], y: findable["y"], findable: new_findable, map: map)
  end
end

MAPS.each do |map|
  new_map = Map.create!(name: map["name"])
  create_or_assign_findables(new_map, :character, map["characters"])
  create_or_assign_findables(new_map, :item,  map["items"])
end

User.create(name: "devel-user")
