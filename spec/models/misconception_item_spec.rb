require 'spec_helper'
require 'ruby-debug'

describe MisconceptionItem do
  before(:each) do
    @misconception_item = MisconceptionItem.new
  end

  describe "name field" do
    it "should update the name" do
      @misconception_item.name = "Subtracting Fractions"
      @misconception_item.name.should == "Subtracting Fractions"
    end
  end

  describe "pattern field" do
    it 'should update the pattern string when we call the setter' do
      pattern_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception_item.pattern = pattern_hash
      
      @misconception_item.pattern.should == pattern_hash
    end

    it 'should update the pattern when pattern is updated' do
      pattern_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception_item.pattern = pattern_hash

      @misconception_item.pattern.should == pattern_hash

      pattern_hash = {"3"=>["1"=>2, "3"=>4], "10"=>["52"=>27,"77"=>93]}
      @misconception_item.pattern = pattern_hash

      @misconception_item.pattern.should == pattern_hash
    end

  end

  describe "paths field" do
    it 'should update the json string when we call the setter' do
      paths_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception_item.paths = paths_hash

      @misconception_item.paths.should == paths_hash
    end

    it 'should update the pattern when pattern is updated' do
      paths_hash = {"30"=>["1"=>2, "3"=>4], "100"=>["52"=>27,"77"=>93]}
      @misconception_item.paths = paths_hash

      @misconception_item.paths.should == paths_hash

      paths_hash = {"3"=>["1"=>2, "3"=>4], "10"=>["52"=>27,"77"=>93]}
      @misconception_item.paths = paths_hash

      @misconception_item.paths.should == paths_hash
    end

  end

  describe "misconception_id field" do
    it "should save the misconception" do
      miscon = Misconception.create!
      @misconception_item.misconception = miscon
      @misconception_item.misconception_id.should == miscon.id
    end
  end


end
