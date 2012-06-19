require 'spec_helper'

describe Misconception do
  before(:each) do
    @valid_attributes = {
      :name => "value for name",
      :pattern => "{\"1\":132,\"2\":154}",
      :paths => "{\"3\":[\"3\":[19,23,43],\"5\":[20,25,33]],\"2\":[\"2\":[11,12,33],\"5\":[13,14,65]]}"
    }
  end

  it "should create a new instance given valid attributes" do
    Misconception.create!(@valid_attributes)
  end
end
