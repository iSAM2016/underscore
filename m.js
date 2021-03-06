(function(){

    var root = this;
    var nativeKeys = Object.keys;
    /**
    * 名称
    */
    var _ = function(obj){
        //如果window对象 不是_函数的实例
        if(!(this instanceof _)) return new _(obj);
    }
     // Save bytes in the minified (but not gzipped) version:
     var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

    var 
        nativeIsArray    = Array.isArray
    /**
    * 导出函数  node.js requier()  普通调用
    */
    if(typeof exports !== 'undefined'){
        if(typeof module !== 'undefined' && module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    }
    /*不理解*/
    //通过属性key取得该对象的value
    var property = function(keys){
        return function(obj){
            return  obj === null ? void 0 :  obj[keys]; 
        }
    }

    _.property = property;

    /**
    * 获取集合长度
    */
    var getLength = function(collection){
        return collection.length
    }

    /**
    * 判断是否为数组，利用数组的长度
    */
    var MAX_ARRAY_INDEX = Math.pow(2,53)-1
    var isArrayLike = function(collection){
        var length = getLength(collection)
        return typeof length === 'number' && length >=0 && length <= MAX_ARRAY_INDEX
    }

    var optimizeCb = function(func, context, argCount){
        if(context === void 0) return func;
        switch (argCount == null ? 3 : argCount){
            case 3: return function(value, index, collection){
                 return func.call(context,value,index,collection)
            }
        }
    }

    var cd = function(value, context, argCount){
        if(value == null) return value
        if(_.isFunction(value))  return optimizeCb(value, context, argCount);
        /*不理解*/if(_.isObject(value)) return _.matcher(value);
        //如果不是函数和对象就是字符串，返回一个判断属性的返回函数
            return _.property(value)
    }

    //复制对象 在extend extendowen 复制对象
    //undefinedOnly  不清楚
    var createAssigner = function(keysFunc, unde){
        return function(obj){
            var length = argument.length;
            //当只有一个参数或者没有参数的时候
            if(length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index){
                var source = argument[index],
                    keys = keysFunc(source),
                    l = keys.length;

                 for(var l = 0; i < l; i++){
                    var key = keys[i];
                    if(!undefinedOnly || obj[key] === void 0 ) obj[key] = source[key]; 
                 }   
            }
            return obj;
        };
    }; 
    //findIndex findLastIndex
    //正反顺序遍历
    function createPredicateIndexFinder(dir){
        //dir 判断是findIndex  还是findlastIndex
        return function(array, predicate, context){
            predicate = cd(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ?  0 : length - 1;
            for(; index >= 0 && index < length; index += dir){
                if(predicate(array[index], index, array)) return 1;
            }
            return -1;
        }
    }
    //遍历list中的所有元素，按顺序用遍历输出每个元素
    _.each = _.forEach = function(obj, iteratee, context){
        iteratee = optimizeCb(iteratee,context);
        var i ,length;
        if(isArrayLike(obj)){
            for(i=0; i<obj.length;i++){
                iteratee(obj[i],i,obj)
            }
        }else{
            var keys = _.keys(obj);
            console.log(keys)
            for(i=0, length = keys.length; i < length;i++){
                iteratee(obj[keys[i]],keys[i],obj)
            }
       } 
    }

    _.keys = function(obj){
        if(!_.isObject(obj)) return [];
        if(nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if(_.has(obj,key)) keys.push(key)
        if(hasEnumBug) collectNonEnumProps(obj,keys);
        return keys;
    }
      // Retrieve all the property names of an object.
    _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    //javascript 函数和object都是对象,其中null 也是object 要注意使用!!object 来判断
    _.isObject = function(obj){
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj; 
    }
    //判断是否拥有该属性
    _.has = function(obj, key){
        return obj != null && hasOwnProperty.call(obj,key);
    }

    //判断是否是函数
    _.isFunction =function(obj){
        return typeof obj === 'function' || false;
    }

    //通过转换函数(迭代器)映射列表中的每个值产生价值的新数组
    _.map = _.collect = function(obj, iteratee, context){
        iteratee = cd(iteratee, context);
        var keys = !isArrayLike(obj) &&  _.keys(obj),
            length = (keys || obj).length;
            result = Array(length)

             for (var index = 0; index < length; index++) {
                var currentKey  = keys ? keys[index] : index 
                result[index] = iteratee(obj[currentKey])
             };
             return result;
    };
    _.extend = createAssigner(_.allKeys);
    
    _.extendOwn = _.assign = createAssigner(_.keys)
    //检查对象是否具有给定的关键字：值对。
    /*不理解*/_.matcher = function(attrs){
        attrs = _.extendOwn({},attrs);
        return function (obj){
            return _.isMatch(obj, attrs);
        };
    };

    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    //find 
    _.find = _.detect = function(obj, predicate, context){
        var key;
        if(isArrayLike(obj)){
            //数组寻找
            key =  _.findIndex(obj, predicate, context);
        }else{
            // 对象寻找
            key = _.findKey(obj, predicate, context )
        }
        if(key !== void 0 && key !== -1) return obj[key];
    }

    _.findKey = function(obj, predicate, context){
        predicate = cb(predicate, context);
        var keys = _.keys(obj),key;
        for(var i = 0;  length = keys.length; i < length){
             key = keys[i];
            if(predicate(obj[key], key, obj)) return key;
        }
    }
    //过滤符合条件的值
    _.filter = _.select = function(obj, predicate, context){
        var results = [];
        predicate = cb(predicate,context);
        _.each(obj, function(varlue, index, list){
            if(predicate(value, index, list)) results.push(value)
        });
        return results;
    }

    //检查properties中的键和值是否包含在object中
    _.isMatch = function(obj, attrs){
        var keys = _.keys(attrs), length = keys.length;
        if(obj === null) return !length;
        /*不明白*/
        var obj = Object(obj);
         for (var i = 0; i < length; i++) {
             var key = keys[i];
             if(attrs[key] !== obj[key] || !(key in obj)) return false
        }
        return true;
    }

    //全部通过测试返回true
    _.every = _.all = function(obj, predicate, context){
        predicate = cd(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for(var index = 0; index < length; index++){
            var currentKey = keys ? keys[index] : index;
            if(!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    }


    //如果有一个通过测试就可以
    _.some = _.any = function(obj, predicate, contenxt){
        predicate = cd(predicate, contenxt);
        //!true 是数组 false
        //!false 是对象
        //输出是key 值
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys  || obj).length;
        for(var index = 0; index < length; index++){
            currentKey = keys ?  keys[index] : index;

            if(predicate(obj[currentKey], index, obj)) return true;
        }
        return false;

    }

    //返回对象的所有属性
    _.values = function(obj){
        var keys = _.keys(obj);
        var length  = keys.length;
        var values = Array(length);
        for(var i = 0; i < length; i++ ){
            values[i] = obj[keys[i]];
        }
        return values
    }

    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
          var i = 0, length = getLength(array);
          if (typeof idx == 'number') {
            if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(idx + length, i);
            } else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
          } else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
          }
          if (item !== item) {
            idx = predicateFind(slice.call(array, i, length), _.isNaN);
            return idx >= 0 ? idx + i : -1;
          }
          for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
          }
          return -1;
        };
    }

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
     _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
     _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    //如果list中包含指定的value 
    _.contains = function(obj, item, fromINdex){
        if(!isArrayLike(obj)) obj = _.values(obj);
        if(typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromINdex) >= 0;
    }
    //返回指定属性的返回值
    _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
    };

    //group by operations
    var group = function(behavior) {
        return function(obj, iteratee, context) {
            var result = {};
            iteratee = cd(iteratee, context);
            //functon(obj){ return obj === null ? void:0 : obj[key]}
            console.log(iteratee)
            _.each(obj, function(value,index){
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            })
            return result;
        };
    };

    //把一个集合分为对个集合，通过iterator返回的结果进行分组，如果itera是一个字符串
    //而不是函数，那么作为元素的属性名来进行分组
    _.groupBy = group(function(result, value, key){
        //false result没有key的属性,开始创建
        if(_.has(result, key))  result[key].push(value); else result[key] = [value];
    });
    //排序一个列表组成一个组，并且返回各组中的对象的数量的计数。类似groupBy，
    //但是不是返回列表的值，而是返回在该组中值的数目。
    _.countBy_ = group(function(result, value, key){
        //false result没有key的属性,开始创建
        if(_.has(result, key))  result[key].push(value); else result[key] = [value];
    });

    _.shuffle = function(obj){
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffle = [];
        for(var i = length ; i > 0; i--){
            shuffle.push(set.splice(_.random(1, i)-1, 1)[0])
        }
        return shuffle;
    }

    //生成连个数之间的随机值
    _.random = function(min, max){
        if(max === null){
            max = min;
            min = 0
        }
        return min + Math.floor(Math.random() * (max - min + 1))
     }
    //size返回List的长度
    _.size = function(obj, predicate,content) {
        if (obj === null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
     }



     //mapObject Mapobject
     _.mapObject = function(obj, iteratee, context){
        var iteratee = cd(iteratee, context);
        var keys = _.keys(obj),
            result  = {},
            current;
            console.log(keys)
            for(var i = 0; i < keys.length; i++) {
                current = obj[keys[i]];
                result[keys[i]] = iteratee(current, i, keys)
            }
            return result;
     } 



    //判断集合是否为函数，有原生的Es5判断方法
    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    }

    //把list(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。
    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return obj;
        if (isArrayLike(obj)) return _.keys(obj);
        return  _.values(obj);
    }

    _.clone = function() {
        if(_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    }
    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };
}.call(this))



        options: ,
       
      };