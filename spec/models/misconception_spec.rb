require 'spec_helper'

describe Misconception do
  before(:each) do
    @valid_attributes = {
      :name => "Adding Fractions",
      :pattern => "{\"1\":132,\"2\":154}",
      :paths => "{\"3\":[\"3\":[19,23,43],\"5\":[20,25,33]],\"2\":[\"2\":[11,12,33],\"5\":[13,14,65]]}"
    }

    @misconception = Misconception.create!(@valid_attributes)
  end

  describe "name field" do
    it "should update the name" do
      @misconception.name = "Subtracting Fractions"
      @misconception.name.should == "Subtracting Fractions"
    end
  end

  describe "pattern field" do
    it "should update the pattern" do
      @misconception.pattern = "{\"2\":1332,\"22\":1454}"
      @misconception.pattern.should == "{\"2\":1332,\"22\":1454}"
    end

    it 'should update the pattern string when we call the setter' do
      pattern_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.json_pattern = pattern_hash

      JSON.parse(@misconception.pattern).should == pattern_hash
    end

    it 'should convert into a hash when we load it from the database' do
      pattern_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.pattern = pattern_hash.to_json
      
      @misconception.json_pattern.should == pattern_hash
    end

    it 'should update the pattern when pattern is updated' do
      pattern_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.json_pattern = pattern_hash

      @misconception.json_pattern.should == pattern_hash

      pattern_hash = {"3"=>["1"=>2, "3"=>4], "10"=>["52"=>27,"77"=>93]}
      @misconception.json_pattern = pattern_hash

      @misconception.json_pattern.should == pattern_hash
    end

  end

  describe "paths field" do
    it "should update the paths" do
      @misconception.paths = "{\"4\":[\"3\":[194,234,443],\"5\":[240,254,334]],\"24\":[\"24\":[141,142,334],\"5\":[13,14,65]]}"
      @misconception.paths.should == "{\"4\":[\"3\":[194,234,443],\"5\":[240,254,334]],\"24\":[\"24\":[141,142,334],\"5\":[13,14,65]]}"
    end

    it 'should update the json string when we call the setter' do
      paths_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.json_paths = paths_hash

      JSON.parse(@misconception.paths).should == paths_hash
    end

    it 'should convert into a hash when we load it from the database' do
      paths_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.paths = paths_hash.to_json
      
      @misconception.json_paths.should == paths_hash
    end

    it 'should update the pattern when pattern is updated' do
      paths_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception.json_paths = paths_hash

      @misconception.json_paths.should == paths_hash

      paths_hash = {"3"=>["1"=>2, "3"=>4], "10"=>["52"=>27,"77"=>93]}
      @misconception.json_paths = paths_hash

      @misconception.json_paths.should == paths_hash
    end

  end


end
