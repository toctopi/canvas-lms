require 'spec_helper'

describe ModulesReleasedToUser do
  before(:each) do
    @valid_attributes = {
      :content_tag_id => 1,
      :user_id => 1,
      :released => false,
      :context_id => 1,
      :context_type => "value for context_type",
      :workflow_state => 1
    }
  end

  it "should create a new instance given valid attributes" do
    ModulesReleasedToUser.create!(@valid_attributes)
  end
end
