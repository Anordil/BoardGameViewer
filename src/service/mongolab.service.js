angular.module("common.mongolab", [])
.factory("MongolabService", ["MONGOLAB_CONFIG", "$http", "$q", function (MONGOLAB_CONFIG, $http, $q) {

	function MongolabServiceFactory(collectionName) {
		var config = {
				"MONGOLAB_CONFIG": angular.extend({
					"API_ENDPOINT": "https://api.mongolab.com/api/1/databases/"
				}, MONGOLAB_CONFIG),
				"params": {
					"apiKey": MONGOLAB_CONFIG.API_KEY
				}
		};

		var dbUrl = config.MONGOLAB_CONFIG.API_ENDPOINT + config.MONGOLAB_CONFIG.DB_NAME;
		var collectionUrl = dbUrl + "/collections/" + collectionName;

		function hydrate(response) {
			if (angular.isArray(response.data)) {
				return response.data.map(function (item) {
					return hydrate({
						"data": item
					});
				});
			}
			return new Document(response.data);
		}


		var Document = function Document(data) {
			angular.extend(this, data);
		};

		// Static methods
		Document.query = function query(queryAsJson, options) {
			options = angular.extend({
				"params": angular.extend(config.params, {
					"q": queryAsJson
				},
				options || {})
			});
			return $http.get(collectionUrl, options)
			.then(hydrate);
		};

		Document.all = function all() {
			return Document.query();
		};

		Document.count = function count(queryAsJson) {
			return Document.query(queryAsJson, {
				"c": true
			});
		};

		Document.findOne = function findOne(id) {
			return $http.get(collectionUrl + "/" + id, {
				"params": config.params
			})
			.then(hydrate);
		};

		Document.find = function find(ids) {
			var queryIds = ids.map(function (id) {
				return {
					"$oid": id
				};
			});
			return Document.query({
				"_id": {
					"$in": queryIds
				}
			});
		};

		Document.save = function save(doc) {
			if (angular.isArray(doc)) {
				return $q.all(doc.map(Document.save));
			}
			// document is not yet a mongodb object.
			if (!doc.$save) {
				doc = new Document(doc);
			}
			return doc.$save();
		};

		// Instance methods
		angular.extend(Document.prototype, {
			"$id": function $id() {
				return (this._id && this._id.$oid) || this._id;
			},
			"$save": function $save() {
				if (this.$id()) {
					return $http.put(collectionUrl + "/" + this.$id(),
							angular.extend({}, this, {
								_id: undefined
							}), {
						"params": config.params
					})
					.then(hydrate);
				} else {
					return $http.post(collectionUrl, this, {
						"params": config.params
					})
					.then(hydrate);
				}
			},
			"$remove": function $remove() {
				return $http(angular.extend({
					"method": "delete",
					"url": collectionUrl + "/" + this.$id()
				}, {
					"params": config.params
				}))
				.then(hydrate);
			}
		});

		return Document;
	}

	return MongolabServiceFactory;
}]);
