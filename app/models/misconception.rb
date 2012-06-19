class Misconception < ActiveRecord::Base

	def pattern=(hash)
		write_attribute(:pattern, hash.to_json)
		@pattern_hash = hash.clone
	end

	def pattern
		@pattern_hash ||= JSON.parse(read_attribute(:pattern))
	end

	def paths=(hash)
		write_attribute(:paths, hash.to_json)
		@paths_hash = hash.clone
	end

	def paths
		@paths_hash ||= JSON.parse(read_attribute(:paths))
	end
end
