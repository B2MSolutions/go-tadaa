module.exports = function(tadaa) {

	return {
	{
		"play a sound when a Go pipeline stage finishes" : {
			"name" : "tadaa-go", 
			"interval": 60000,
			"logic" : [{fn: tadaa.up, sound: "release.ogg"}],
			"valueFn" : "getLastBuildNumber",
			"options" : {
				"username" : "MyGoUsername",
				"password" : "MyGoPassword",
				"project" : "GoProjectName",
				"url" : "https://my.go.server.com:8153/go/cctray.xml"
			}
		},
		"play sounds when a build fails or recovers from a fail" : {
			"name" : "tadaa-example",
			"interval": 60000,
			"logic" : [
				{fn: tadaa.up, sound: "build-fail.ogg"},
				{fn: tadaa.down, sound: "build-recover.ogg"},
				{fn: tadaa.dropToZero, sound: "build-clear.ogg"}
			],
			"valueFn": "getNumberOfFailures", 
			"options" : {
				"username" : "MyGoUsername",
				"password" : "MyGoPassword",
				"project" : "GoProjectName",
				"url" : "https://my.go.server.com:8153/go/cctray.xml"
			}
		}
	}
}