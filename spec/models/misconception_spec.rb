require 'spec_helper'
require 'ruby-debug'

describe Misconception do
  before(:each) do
    @context = course
    @bank = @course.assessment_question_banks.create!(:title=>'Test Bank')
    @bank.assessment_questions.create!(:question_data => {'name' => 'test question', 'answers' => [{'id' => 1}, {'id' => 2}]})
    @bank.assessment_questions.create!(:question_data => {'name' => 'test question 2', 'answers' => [{'id' => 3}, {'id' => 4}]})
    @bank.assessment_questions.create!(:question_data => {'name' => 'test question 3', 'answers' => [{'id' => 3}, {'id' => 4}]})
    @bank.assessment_questions.create!(:question_data => {'name' => 'test question 4', 'answers' => [{'id' => 3}, {'id' => 4}]})
    @quiz = @course.quizzes.create!(:title => "some quiz")
    @group = @quiz.quiz_groups.create!(:name => "question group", :pick_count => 3, :question_points => 5.0)
    @group.assessment_question_bank = @bank
    @group.save

    @valid_attributes = {
      :quiz_id => @bank.id
    }
    @misconception = Misconception.new
  end

  it "should create a new instance given valid attributes" do
    Misconception.create!(@valid_attributes)
  end

  describe "quiz_id field" do
  	it "should store the id of the quiz" do
  		@misconception.quiz_id.should be_nil
  		@misconception.quiz_id = @bank.id
  		@misconception.quiz_id.should == @bank.id
  	end

  	it "should save the quiz" do
  		@misconception.quiz = @quiz
  		@misconception.quiz_id.should == @bank.id
  	end
  end

  describe "misconception_items access" do
  	it "should be available" do
  		miscon_item = MisconceptionItem.create!
  		@misconception.misconception_items << miscon_item
      debugger
  		@misconception.misconception_items.first.id.should == miscon_item.id
  	end
  end

  describe "context access" do
    it "should save to the current context" do 
      debugger
      @misconception.context << @context
      @misconception.context_id.should == @context.id
    end
  end

end
