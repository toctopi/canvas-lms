class Misconception < ActiveRecord::Base
	#attr_accessible :name, :pattern, :paths

	def json_pattern=(hash)
		self.pattern = hash.to_json
		@pattern_hash = hash.clone
	end

	def json_pattern
		@pattern_hash ||= JSON.parse(self.pattern)
	end

	def json_paths=(hash)
		self.paths = hash.to_json
		@paths_hash = hash.clone
	end

	def json_paths
		@paths_hash ||= JSON.parse(self.paths)
	end
end
