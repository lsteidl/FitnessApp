import React, { Component } from 'react';
import { ListItem } from 'react-native-elements'
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, StyleSheet, KeyboardAvoidingView, TouchableHighlightBase } from 'react-native';
import LoginForm from './LoginForm';
import base64 from 'base-64';
import { AsyncStorage } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { List } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { Banner } from 'react-native-paper';


class Profile extends React.Component {

    async load() {
        const token = await AsyncStorage.getItem('token');
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const res = await AsyncStorage.getItem('res');
        console.log(res);
        this.setState({ user: username })
        this.setState({ pass: password })
        await this.setState({ key: token })
        console.log("LOAD PROFILE");
       // if (AsyncStorage.getItem('act') === null) { }
       // else {
            const goalDailyActivity = await AsyncStorage.getItem('act');
            const goalDailyCalories = await AsyncStorage.getItem('cal');

            const goalDailyCarbohydrates = await AsyncStorage.getItem('carb');
            const goalDailyFat = await AsyncStorage.getItem('fat');
            const goalDailyProtein = await AsyncStorage.getItem('pro');
            const firstName = await AsyncStorage.getItem('first');
            const lastName = await AsyncStorage.getItem('last');



            // this.setState({res : res})
            this.setState({ act: goalDailyActivity })
            this.setState({ cal: goalDailyCalories })
            this.setState({ carbs: goalDailyCarbohydrates })
            this.setState({ fat: goalDailyFat })
            this.setState({ pro: goalDailyProtein })
            this.setState({ first: firstName })
            this.setState({ last: lastName })
      //  }

    }
    onEdit() {
        this.setState({ mode: 'edit' })
    }
    onActEdit() {

    }
    switchToAdd() {
        this.setState({ mode: 'add' })
    }
    async onActEdit(key, name, duration, calories) {
        console.log("editing activity")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", this.state.key);
        //myHeaders.append("Authorization", "Basic ZG9nMTExOmRvZzExMQ==");

        var raw = "{\n\"name\": \"" + name + "\",\n\"duration\": " + duration + ",\n\"calories\": " + calories + "\n}";

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + key, requestOptions)
        var result = await response.json();
        console.log(result)
        console.log(result.message)
        if (result.message === "400 Bad Request: The browser (or proxy) sent a request that this server could not understand.") {
            Alert.alert('Could not update, please fill in every field with corresponding value. (Date is optional)');
        }

        await this.fetchAct()
        this.switchToSummary()
    }
    clear() {
        newmealfoods = [];
        this.setState({ mealFoods: newmealfoods })
    }

    async onAddFood() {
        const food = {
            name: this.state.food_name, calories: this.state.food_cal, protein: this.state.food_pro,
            carbohydrates: this.state.food_carb, fat: this.state.food_fat
        }

    }
    async onAddMeal(add) {
        const meal = { name: this.state.meal_name, date: this.state.meal_date };
        // create new meal
        await fetch("https://mysqlcs639.cs.wisc.edu/meals", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": this.state.key
            },
            body: JSON.stringify(meal)
        })
            .then(res => res.json())
            .then(data => this.setState({ meal_id: data.id }))
            .catch(err => console.log(err))
        console.log("ADDING MEALFOODS LOOKS LIKE")
        console.log(this.state.mealFoods)
        // add food to meal
        for (let i = 0; i < this.state.mealFoods.length; i++) {
            const foods = { foods: this.state.mealFoods[i] }
            console.log("ADDING...")
            await fetch(
                "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.meal_id + "/foods",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-access-token": this.state.key
                    },
                    body: JSON.stringify(foods.foods)
                }
            ).catch(err => console.log(err));
        }
        if (add) {
            Alert.alert("Meal Added")
            this.switchToSummary();
        }
        else {
            Alert.alert("Meal Updated")
        }
        this.clear()

    }
    async onAdd() {
        console.log("adding activity")
        const data = {
            name: this.state.act_name,
            duration: this.state.act_dur,
            date: this.state.act_date,
            calories: this.state.act_cal,
        }
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": this.state.key
            },
            body: JSON.stringify(data)
        });
        console.log(response)
        var result = await response.json();
        console.log(result)
        await this.fetchAct()
        this.setState({ mode: 'summary' })

        //this.setState({mode: 'add'})

    }
    async switchToSummary() {
        await this.fetchFood()
        await this.fetchMeals()
        await this.fetchMealFoods()
        await this.foodSummary()
        this.setState({ mode: 'summary' })
    }
    switchToActEdit(key) {
        console.log("act_key is " + key)
        this.setState({ act_key: key });
        this.setState({ mode: 'act_edit' })
    }
    switchToProfile() {
        this.setState({ mode: 'view' })
    }
    switchToAddFood() {
        this.setState({ mode: 'addFood' })
    }
    async deleteAccount() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", this.state.key);
        //    myHeaders.append("Authorization", "Basic ZG9nMTExOmRvZzExMQ==");

        // var raw = "{\n\"name\": \" " + name +"\",\n\"duration\": "+duration+ ",\n\"calories\": "+calories+"\n}";   
        var raw = "{\n\"name\": \"NEW NAME\",\n\"duration\": 900,\n\"calories\": 9\n}";

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        //console.log("using key = " + key);
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.user, requestOptions)

        if (response.message === "Account deleted!") {
            Alert.alert("Account Deleted!");
        }
        console.log(response)
        this.props.goToWelcome()

    }
    async onDeleteMeal() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", this.state.key);
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            // body: raw,
            redirect: 'follow'
        };
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.curr_meal.id, requestOptions)
        if (response.message === "Meal deleted!") {
            Alert.alert("Meal deleted!");
        }
        console.log(response)
        this.switchToSummary()
    }
    async onActDelete(key) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", this.state.key);
        //    myHeaders.append("Authorization", "Basic ZG9nMTExOmRvZzExMQ==");

        // var raw = "{\n\"name\": \" " + name +"\",\n\"duration\": "+duration+ ",\n\"calories\": "+calories+"\n}";   
        var raw = "{\n\"name\": \"NEW NAME\",\n\"duration\": 900,\n\"calories\": 9\n}";

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        console.log("using key = " + key);
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + key, requestOptions)
        if (response.message === "Activity deleted!") {
            Alert.alert("Activity deleted!");
        }
        console.log(response)
        this.fetchAct()
        this.switchToSummary()
    }
    compareSingleToAdd(food) {
        for (const item of this.state.singleMealFoods) {
            if (item.calories === food.calories) {
                if (item.name === food.name) {
                    return true;
                }
            }
        }
        return false;
    }
    compareSingleToRemove(food){
        for(const item of this.state.mealFoods){
            if (item.calories === food.calories) {
                if (item.name === food.name) {
                    return false;
                }
            }
        }
        // returns true if food cannot be found in current mealFoods
        return true;
    }
    async onMealUpdate(key) {
     //   console.log("ON UPDATE")
       await this.onAddMeal(false)
        await this.onDeleteMeal() 
    // remove unchecked
     //   this.fetchSingleMealFoods()
        // console.log("AFTER Single meal foods...")
        // console.log(this.state.singleMealFoods)
        // console.log("MEAL FOODS...potential updated list...")
        // console.log(this.state.mealFoods)
        // for (const item of this.state.singleMealFoods) {
        //     if (this.compareSingleToRemove(item)){
        //         var myHeaders = new Headers();
        //         myHeaders.append("Content-Type", "application/json");
        //         myHeaders.append("x-access-token", this.state.key);
        //         var requestOptions = {
        //             method: 'DELETE',
        //             headers: myHeaders,
        //             //body: raw,
        //             redirect: 'follow'
        //         };
        //         console.log("using key = " + key);
        //         console.log(item.id)
        //         let response = await fetch("https://mysqlcs639.cs.wisc.edu/meals/" + this.state.meal_id + "/foods/"+item.id, requestOptions)
        //         console.log(response)
        //     }
        // }
    // // add new
    //       this.fetchSingleMealFoods(this.state.meal_id)
    //         var myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");
    //         myHeaders.append("x-access-token", this.state.key);
    //         for (let i = 0; i < this.state.mealFoods.length; i++) {
    //             if(this.compareSingle(this.state.mealFoods[i])){

    //             }
    //             else{
    //             const foods = { foods: this.state.mealFoods[i] }
    //             console.log("ADDING...")
    //             await fetch(
    //                 "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.meal_id + "/foods",
    //                 {
    //                     method: "PUT",
    //                     headers: {
    //                         Accept: "application/json",
    //                         "Content-Type": "application/json",
    //                         "x-access-token": this.state.key
    //                     },
    //                     body: JSON.stringify(foods.foods)
    //                 }
    //             ).catch(err => console.log(err));
    //             }
    //         }
        this.switchToSummary()
    }
    async onUpdate() {
        console.log("updated")
        const data = {
            admin: false,
            firstName: this.state.first,
            goalDailyActivity: this.state.act,
            goalDailyCalories: this.state.cal,
            goalDailyCarbohydrates: this.state.carbs,
            goalDailyFat: this.state.fat,
            goalDailyProtein: this.state.pro,
            lastName: this.state.last,
        }
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.user, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": this.state.key
            },
            body: JSON.stringify(data)
        });
        let result = await response.json()
        console.log(result)
        this.setState({ mode: 'view' })
        //  this.setState({mode: 'add'})
    }
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            pass: '',
            key: '',
            id: '',
            first: '',
            last: '',
            res: '',
            mode: 'summary',
            act: '',
            cal: '',
            carbs: '',
            fat: '',
            pro: '',
            act_name: '',
            act_dur: '',
            act_date: '',
            act_cal: '',
            act_key: '',
            activities: [],
            foods: {},
            meals: [],
            mealFoods: [],
            foodCount: [],
            summaryMealFoods: [],
            meal_name: '',
            meal_date: '',
            meal_id: '',
            meal_key: '',
            singleMealFoods: [],
            curr_meal: '',
            food_name: '',
            food_cal: '',
            food_carb: '',
            food_pro: '',
            food_fat: '',

        }
        //this.load()
        //this.getActivities();
    }
    async fetchSingleMealFoods(id) {
        var singleFoods = [];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", this.state.key);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        // console.log(meal.id)
        //var meal = this.state.meals[index]
        let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods', requestOptions)
        let result = await response.json()
        console.log("SINGLE MEAL FOODS")
        console.log(result)
        console.log("VS")

        //singleFoods.push(result)
        for (const food of result.foods) {
            console.log(food)
            singleFoods.push(food)
        }
        await this.setState({ mealFoods: singleFoods })
        await this.setState({ singleMealFoods: singleFoods })
        console.log("TESTFOODS")
        console.log(this.state.mealFoods)
    }
    async fetchMealFoods() {
        var mealFoods = [];
        var foodCount = [];
        var count = 0;
        console.log("all meals")
        console.log(this.state.meals)
        for (const meal of this.state.meals) {
            console.log("fetchmealfoods")
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("x-access-token", this.state.key);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            console.log(meal.id)
            let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods', requestOptions)
            let result = await response.json()
            console.log("result fetchMeal for loop FOODS is....")
            console.log(result)
            console.log("pushing...")
            count = 0;
            for (const food of result.foods) {
                console.log(food)
                mealFoods.push(food)
                count++;

            }
            console.log("push count === " + count)
            foodCount.push(count)
        }
        await this.setState({ summaryMealFoods: mealFoods })
        await this.setState({ foodCount: foodCount })
        console.log("FOOD COUNT ARRAY")
        console.log(this.state.foodCount)
    }
    async fetchMeals() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log(this.state.key)
        myHeaders.append("x-access-token", this.state.key);
        //myHeaders.append("Authorization", "Basic " + base64.encode(this.state.user + ':' + this.state.pass));
        //var raw = "{\n\"username\" : \" " + username + "\",\n\"password\" : \" " + password + "\"\n}";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            //body: raw,
            redirect: 'follow'
        };

        let response = await fetch('https://mysqlcs639.cs.wisc.edu/meals', requestOptions)
        let result = await response.json()

        await this.setState({ meals: result.meals })
        console.log("meal fetching");
        console.log(result);
        console.log(this.state.foods)
    }
    async fetchFood() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log("key is")
        console.log(this.state.key)
        myHeaders.append("x-access-token", this.state.key);
        //myHeaders.append("Authorization", "Basic " + base64.encode(this.state.user + ':' + this.state.pass));
        //var raw = "{\n\"username\" : \" " + username + "\",\n\"password\" : \" " + password + "\"\n}";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            //body: raw,
            redirect: 'follow'
        };

        let response = await fetch('https://mysqlcs639.cs.wisc.edu/foods', requestOptions)
        let result = await response.json()

        await this.setState({ foods: result.foods })
        console.log("food state set");
        // console.log(result.foods);
        // console.log(this.state.foods)

    }
    async fetchAct() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log("key is")
        console.log(this.state.key)
        myHeaders.append("x-access-token", this.state.key);
        //myHeaders.append("Authorization", "Basic " + base64.encode(this.state.user + ':' + this.state.pass));
        //var raw = "{\n\"username\" : \" " + username + "\",\n\"password\" : \" " + password + "\"\n}";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            //body: raw,
            redirect: 'follow'
        };

        let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities', requestOptions)
        let result = await response.json()
        console.log(result);
        await this.setState({ activities: result.activities })
        console.log("State set");
        //console.log(this.state.activites)
    }
    async componentDidMount() {
        await this.load()
        await this.fetchAct()
        await this.fetchFood()
        await this.fetchMeals()
        await this.fetchMealFoods()
        await this.foodSummary()
        this.clear()
    }
    foodSummary() {
        var food_summary = [];
        var total_foods = this.state.meals.length;
        var total_calories = 0;
        var total_protein = 0;
        var total_fat = 0;
        var total_carbs = 0;
        console.log("MEAL FOODS")
        console.log(this.state.summaryMealFoods.length)
        console.log(this.state.summaryMealFoods)
        if (this.state.summaryMealFoods.length > 0) {
            console.log("calories: " + this.state.summaryMealFoods[0].calories)
        }
        // console.log("foods here")
        //console.log(this.state.foods)
        for (let i = 0; i < this.state.summaryMealFoods.length; i++) {
            total_calories += this.state.summaryMealFoods[i].calories;
            total_protein += this.state.summaryMealFoods[i].protein;
            total_fat += this.state.summaryMealFoods[i].fat;
            total_carbs += this.state.summaryMealFoods[i].carbohydrates;
        }
        // food_summary.push(
        //     <View key = {0}>
        //              <List.Item title="Number of Meals" description={5}></List.Item>
        //              <List.Item title="Total Calories" description={340}></List.Item>
        //              <List.Item title="Total Protein" description={540}></List.Item>
        //              <List.Item title="Total Fat" description={99 }></List.Item>
        //              <List.Item title="Total Carbohydrates" description={1500}></List.Item>
        //         </View>
        // )
        food_summary.push(
            <View key={0}>
                <List.Item title="Number of Meals" description={total_foods}></List.Item>
                <List.Item title="Total Calories" description={total_calories}></List.Item>
                <List.Item title="Total Protein" description={total_protein}></List.Item>
                <List.Item title="Total Fat" description={total_fat}></List.Item>
                <List.Item title="Total Carbohydrates" description={total_carbs}></List.Item>
            </View>
        )
        return food_summary;
    }
    actSummary() {
        var activity_summary = [];
        var total_activities = this.state.activities.length;
        var total_duration = 0;
        var total_calories = 0;
        for (let i = 0; i < this.state.activities.length; i++) {
            total_calories += this.state.activities[i].calories;
            total_duration += this.state.activities[i].duration;

        }
        activity_summary.push(
            <View key={0}>
                <List.Item title="Number of Activites" description={total_activities}></List.Item>
                <List.Item title="Total Duration" description={total_duration}></List.Item>
                <List.Item title="Total Calories" description={total_calories}></List.Item>
            </View>
        )
        return activity_summary
    }
    switchToProgress(){
        this.setState({mode: 'progress'})
    }
    switchToActCT() {
        this.setState({ mode: 'addCT' });
    }
    switchToAddMeal() {
        { this.fetchFood() }
        this.setState({ mode: 'addMeal' })
    }
    async switchToEditMeal(index) {
        console.log("EDITING")
        console.log(index)
        console.log(this.state.meals[index])
        console.log(this.state.meals[index].id)
        await this.fetchSingleMealFoods(this.state.meals[index].id)
        //  this.setState({meal_key : this.state.meals[index].id});
        this.setState({ curr_meal: this.state.meals[index] })
        this.setState({ mode: 'editmeal' })
    }
    compare(food) {
        for (const item of this.state.mealFoods) {
            if (item.calories === food.calories) {
                if (item.name === food.name) {
                    return true;
                }
            }
        }
        return false;

    }
    switchToFoods() {
        this.setState({ mode: 'foods' })
    }
    viewFoods() {
        var all_food = [];
        for (const food of this.state.foods) {
            all_food.push(
                <View key={food}>
                    <ListItem
                        key={food.name}
                        bottomDivider
                        title={food.name}
                        subtitle={
                            "Calories: " + food.calories +
                            " Carbs: " + food.carbohydrates +
                            " Fat: " + food.fat +
                            " Protein " + food.protein
                        }
                    />
                    {/* {<Button mode="contained" onPress={() => this.switchToActEdit(i)}>
                            <Text> Delete Food </Text>
                </Button>} */}
                </View>
            )
        }
        return all_food;
    }
    getProgress(){
        var progress = [];
        var total_activities = this.state.activities.length;
        var total_foods = this.state.meals.length;
        var total_calories = 0;
        var total_protein = 0;
        var total_fat = 0;
        var total_carbs = 0;
        for (let i = 0; i < this.state.summaryMealFoods.length; i++) {
            total_calories += this.state.summaryMealFoods[i].calories;
            total_protein += this.state.summaryMealFoods[i].protein;
            total_fat += this.state.summaryMealFoods[i].fat;
            total_carbs += this.state.summaryMealFoods[i].carbohydrates;
        }
        progress.push(
            <View key={total_activities}>
                <List.Item title="Total Activity" description={total_activities}></List.Item>
                <List.Item title="Goal Activity" description={this.state.act}></List.Item>
            </View>
        );
        if(total_activities > this.state.act){
            progress.push(
                <Button key ={122} mode="text" >
                     <Text> Goal Complete!</Text>
                </Button>
            )
        }
        else(
            progress.push(
                <Button key ={222} mode="text" >
                     <Text> Incomplete!</Text>
                </Button>
            )
        )
        progress.push(
            <View key={total_calories}>
            <List.Item title="Total Calories" description={total_calories}></List.Item>
            <List.Item title="Goal Calories" description={this.state.cal}></List.Item>
         
        </View>
        )
        if(total_calories > this.state.cal){
            progress.push(
                <Button key ={32} mode="text" >
                     <Text> Goal Complete!</Text>
                </Button>
            )
        }
        else(
            progress.push(
                <Button key ={42} mode="text" >
                     <Text> Incomplete!</Text>
                </Button>
            )
        )
        progress.push(
            <View key={total_protein}>
            <List.Item title="Total Protein" description={total_protein}></List.Item>
            <List.Item title="Goal Protein" description={this.state.pro}></List.Item>
        </View>
        )
        if(total_protein > this.state.pro){
            progress.push(
                <Button key ={322} mode="text" >
                     <Text> Goal Complete!</Text>
                </Button>
            )
        }
        else(
            progress.push(
                <Button key ={324} mode="text" >
                     <Text> Incomplete!</Text>
                </Button>
            )
        )
        progress.push(
            <View key={total_fat}>
            <List.Item title="Total Fat" description={total_fat}></List.Item>
            <List.Item title="Goal Fat" description={this.state.fat}></List.Item>
        </View>
        )
        if(total_fat > this.state.fat){
            progress.push(
                <Button key ={444} mode="text" >
                     <Text> Goal Complete!</Text>
                </Button>
            )
        }
        else(
            progress.push(
                <Button key ={4444} mode="text" >
                     <Text> Incomplete!</Text>
                </Button>
            )
        )
        progress.push(
            <View key={total_carbs}>
            <List.Item title="Total Carbohydrates" description={total_carbs}></List.Item>
            <List.Item title="Goal Carbohydrates" description={this.state.carbs}></List.Item>
        </View>
        )
        if(total_carbs > this.state.carbs){
            progress.push(
                <Button key ={524} mode="text" >
                     <Text> Goal Complete!</Text>
                </Button>
            )
        }
        else(
            progress.push(
                <Button key ={522} mode="text" >
                     <Text> Incomplete!</Text>
                </Button>
            )
        )
        return progress;

    }
    getFoods() {
        var all_food = [];
        for (const food of this.state.foods) {
            all_food.push(
                <ListItem
                    key={food.name}
                    bottomDivider
                    title={food.name}
                    subtitle={
                        "Calories: " + food.calories +
                        " Carbs: " + food.carbohydrates +
                        " Fat: " + food.fat +
                        " Protein " + food.protein
                    }
                    checkBox={{
                        checked: this.compare(food),
                        onPress: () => this.checkFood(food)
                    }}
                />
            );
        }
        return all_food;
    };
    //checkFood = food => {
    checkFood(food) {
        var meal = this.state.mealFoods;
        if (this.compare(food)) {
            console.log(meal.indexOf(food))
         meal.splice(meal.indexOf(food))
            this.setState({ mealFoods: meal })
        }
        else {
           meal.push(food);
            this.setState({ mealFoods: meal });
        }
    }
    getMeals() {
        var meal_summary = [];
        var total_calories = 0;
        var total_protein = 0;
        var total_fat = 0;
        var total_carbs = 0;
        console.log("getMeals food count array")
        console.log(this.state.foodCount)
        console.log("Getting MEALS")
        console.log(this.state.summaryMealFoods.length)
        //console.log(this.state.summaryMealFoods)
        if (this.state.summaryMealFoods.length > 0) {
            console.log("calories: " + this.state.summaryMealFoods[0].calories)
        }
        console.log(this.state.summaryMealFoods.length)
        console.log(this.state.foods)
        var sum = 0;
        var meal = 0;
        for (let i = 0, index = 0; i < this.state.summaryMealFoods.length; i++) {

            console.log("OUTER LOOP")
            total_calories += this.state.summaryMealFoods[i].calories;
            total_protein += this.state.summaryMealFoods[i].protein;
            total_fat += this.state.summaryMealFoods[i].fat;
            total_carbs += this.state.summaryMealFoods[i].carbohydrates;
            console.log("Count for this meal.....")
            console.log(this.state.foodCount[meal])
            console.log("comparing : " + i + " and " + (this.state.foodCount[meal] + sum - 1))
            if ((i) === (this.state.foodCount[meal] + sum - 1)) {
                console.log("FULL MEAL")
                sum = i + 1;
                meal_summary.push(
                    <View key={this.state.meals[meal].name}>
                        <List.Item title="Name" description={this.state.meals[meal].name}></List.Item>
                        <List.Item title="Total Calories" description={total_calories}></List.Item>
                        <List.Item title="Total Protein" description={total_protein}></List.Item>
                        <List.Item title="Total Fat" description={total_fat}></List.Item>
                        <List.Item title="Total Carbohydrates" description={total_carbs}></List.Item>
                        {/* {<Button mode="contained" onPress={() => this.switchToEditMeal(index-1)}>
                            <Text> Edit Meal </Text>
                        </Button>
                        } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToEditMeal(index - 1)}>
                            <Text style={styles.buttonText}>Edit Meal</Text>
                        </TouchableOpacity>}
                    </View>
                )
                index++;
                meal++;
                total_calories = 0;
                total_protein = 0;
                total_fat = 0;
                total_carbs = 0;
            }
        }
        return meal_summary;

    }
    getActivities() {

        var activity_summary = [];
        console.log("OUTfot")
        console.log("length= " + this.state.activities.length)
        for (let i = 0; i < this.state.activities.length; i++) {
            console.log("inside fot")
            console.log(this.state.activities)
            if (this.state.activities[i].name != undefined) {
                activity_summary.push(

                    <View key={i} >

                        <List.Item title="Name" description={this.state.activities[i].name}></List.Item>
                        <List.Item title="Duration" description={this.state.activities[i].duration}></List.Item>
                        <List.Item title="Date" description={this.state.activities[i].date}></List.Item>
                        <List.Item title="Calories" description={this.state.activities[i].calories}></List.Item>
                        {/* {<Button mode="contained" onPress={() => this.switchToActEdit(i)}>
                            <Text> Edit Activity </Text>
                        </Button>
                        } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToActEdit(i)}>
                            <Text style={styles.buttonText}>Edit Activity</Text>
                        </TouchableOpacity>}
                    </View>
                )
            }

        }
        return activity_summary
    }
    render() {
        // {this.load()} 
        if (this.state.mode === 'view') {
            //{this.load()} 
            return (

                <ScrollView >
                    <View >

                        <Text style={styles.text} > Profile</Text>
                        <View>
                            <List.Item title="First Name" description={this.state.first}></List.Item>
                            <List.Item title="Last Name" description={this.state.last}></List.Item>
                            <List.Item title="Username" description={this.state.user}></List.Item>
                        </View>
                    </View>
                    <View >
                        <Text style={styles.text} > Goals </Text>
                        <View >
                            <List.Item title="Daily Activity" description={this.state.act}></List.Item>

                            <List.Item title="Daily Calories" description={this.state.cal}></List.Item>
                            <List.Item title="Daily Carbohydrates" description={this.state.carbs}></List.Item>
                            <List.Item title="Daily Fat" description={this.state.fat}></List.Item>
                            <List.Item title="Daily Protein" description={this.state.pro}></List.Item>
                        </View>
                    </View>
                    {/* {<Button mode="contained" onPress={() => this.onEdit()}>
                        <Text >Modify Goals / Info</Text>
                    </Button>
                    } */}
                    {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onEdit()}>
                        <Text style={styles.buttonText}>Modify Goals / Info</Text>
                    </TouchableOpacity>}
                    {/* {<Button mode="contained" onPress={() => this.switchToSummary()}>
                        <Text> Back to Summary </Text>
                    </Button>
                    } */}
                    {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                        <Text style={styles.buttonText}>Back to Summary</Text>
                    </TouchableOpacity>}
                    {/* {<Button mode="contained" onPress={() => this.props.goToWelcome()}>
                        <Text >Log Out </Text>
                    </Button>
                    } */}
                    {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.props.goToWelcome()}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>}
                    {/* {<Button mode="contained" onPress={() => this.deleteAccount()}>
                        <Text> Delete Account</Text>
                    </Button>
                    } */}
                    {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.deleteAccount()}>
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>}

                </ScrollView>
            )
        }
        if (this.state.mode === 'foods') {
            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <Text style={styles.text} > Foods </Text>
                        {this.viewFoods()}
                        {/* {<Button mode="contained" onPress={() => this.switchToAddFood()}>
                        <Text> Add New Food</Text>
                    </Button>
                    } */}
                        {<Button mode="contained" onPress={() => this.switchToSummary()}>
                            <Text> Back to Summary </Text>
                        </Button>
                        }
                    </ScrollView >
                </KeyboardAvoidingView>
            )
        }
        if (this.state.mode === 'edit') {
            return (
                <KeyboardAvoidingView >
                    <ScrollView >

                        <Text style={styles.text} > Profile</Text>
                        <View>
                            <List.Item title="First Name" ></List.Item>
                            <TextInput label={this.state.first} onChangeText={text => this.setState({ first: text })} />
                            <List.Item title="Last Name" ></List.Item>
                            <TextInput label={this.state.last} onChangeText={text => this.setState({ last: text })} />
                            <List.Item title="Username"  ></List.Item>
                        </View>

                        <View >
                            <Text style={styles.text} > Goals </Text>
                            <View >
                                <List.Item title="Daily Activity"></List.Item>
                                <TextInput label={this.state.act} onChangeText={text => this.setState({ act: text })} />
                                <List.Item title="Daily Calories" ></List.Item>
                                <TextInput label={this.state.cal} onChangeText={text => this.setState({ cal: text })} />
                                <List.Item title="Daily Carbohydrates"></List.Item>
                                <TextInput label={this.state.carbs} onChangeText={text => this.setState({ carbs: text })} />
                                <List.Item title="Daily Fat"> </List.Item>
                                <TextInput label={this.state.fat} onChangeText={text => this.setState({ fat: text })} />
                                <List.Item title="Daily Protein" ></List.Item>
                                <TextInput label={this.state.pro} onChangeText={text => this.setState({ pro: text })} />
                            </View>
                        </View>

                        <View>
                            {/* <Button mode="contained" onPress={() => this.onUpdate()}>
                                <Text >Update</Text>
                            </Button> */}
                            {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onUpdate()}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                                <Text style={styles.buttonText}>Back to Summary</Text>
                            </TouchableOpacity>}

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )
        }
        if (this.state.mode == 'progress') {
            return (
                <ScrollView>
                    <View >
                        <Text style={styles.text} > Track Progress </Text>
                        <View >
                            {this.getProgress()}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                                <Text style={styles.buttonText}>Back to Summary</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </ScrollView>
            )
        }
        if (this.state.mode === 'summary') {

            return (

                <KeyboardAvoidingView >
                    <ScrollView >

                        <Text style={styles.text}> Activity Summary</Text>
                        {this.actSummary()}
                        <Text style={styles.text}> Food Summary</Text>
                        {this.foodSummary()}
                        <Text style={styles.text}> All Activities</Text>
                        {this.getActivities()}
                        <Text style={styles.text}> All Meals</Text>
                        {this.getMeals()}

                        {/* <Button  accessibilitylabel = "Add New Activity" mode="contained" onPress={() => this.switchToAdd()}>
                            <Text >Add New Activity</Text>
                        </Button> */}
                        {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.switchToAdd()}>
                            <Text style={styles.buttonText}>Add New Activity </Text>
                        </TouchableOpacity>}

                        {/* <Button mode="contained" onPress={() => this.switchToAddMeal()}>
                            <Text >Add New Meal</Text>
                        </Button> */}

                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToAddMeal()}>
                            <Text style={styles.buttonText}>Add New Meal</Text>
                        </TouchableOpacity>}
                        {/* <Button mode="contained" onPress={() => this.switchToFoods()}>
                            <Text >View Foods</Text>
                        </Button> */}
                        {/* <Button mode="contained" onPress={() => this.switchToProfile()}>
                            <Text >Go to Profile</Text>
                        </Button> */}

                        {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.switchToProfile()}>
                            <Text style={styles.buttonText}>Go to Profile </Text>
                        </TouchableOpacity>}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToProgress()}>
                            <Text style={styles.buttonText}>View Progress</Text>
                        </TouchableOpacity>}
                    </ScrollView>
                </KeyboardAvoidingView>

            )

        }
        if (this.state.mode == 'editmeal') {
            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        {/* <View> */}
                            <Text style={styles.text} > Edit Meal </Text>
                            <TextInput label={this.state.curr_meal.name} onChangeText={text => this.setState({ meal_name: text })} />
                            <TextInput label={this.state.curr_meal.date} onChangeText={text => this.setState({ meal_date: text })} />
                            <Text style={styles.text} > What's in the Meal? </Text>
                            {this.getFoods()}
                            <Text> </Text>

                            {/* {<Button mode="contained" onPress={() => this.onMealUpdate()}>
                        <Text> Update Meal </Text>
                    </Button>
                    } */}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onMealUpdate()}>
                                <Text style={styles.buttonText}>Update Meal</Text>
                            </TouchableOpacity>}
                            {/* {<Button mode="contained" onPress={() => this.onDeleteMeal()}>
                        <Text> Delete Meal </Text>
                    </Button>
                    } */}

                            {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onDeleteMeal()}>
                                <Text style={styles.buttonText}>Delete Meal</Text>
                            </TouchableOpacity>}

                            {/* {<Button mode="contained" onPress={() => this.switchToSummary()}>
                        <Text> Back to Summary </Text>
                    </Button>
                    } */}

                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                                <Text style={styles.buttonText}>Back to Summary</Text>
                            </TouchableOpacity>}

                        {/* </View> */}
                    </ScrollView >
                </KeyboardAvoidingView >

            )
        }
        if (this.state.mode === 'addMeal') {

            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <View>
                            <Text style={styles.text} > Add New Meal </Text>
                            <TextInput label="Name" onChangeText={text => this.setState({ meal_name: text })} />
                            <TextInput label="Date/Time" onChangeText={text => this.setState({ meal_date: text })} />
                            <Text style={styles.text} > What's in the Meal? </Text>
                            {this.getFoods()}
                            <Text> </Text>

                            {/* {<Button mode="contained" onPress={() => this.onAddMeal(true)}>
                        <Text> Add Meal </Text>
                    </Button>
                    } */}
                            {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onAddMeal(true)}>
                                <Text style={styles.buttonText}>Add Meal</Text>
                            </TouchableOpacity>}
                            {/* {<Button mode="contained" onPress={() => this.switchToSummary()}>
                        <Text> Back to Summary </Text>
                    </Button>
                    } */}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                                <Text style={styles.buttonText}>Back to Summary</Text>
                            </TouchableOpacity>}
                        </View>
                    </ScrollView >
                </KeyboardAvoidingView >
            )

        }
        if (this.state.mode === 'addFood') {
            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <View>
                            <Text style={styles.text} > Add New Food </Text>
                            <TextInput label="Name" onChangeText={text => this.setState({ food_name: text })} />
                            <TextInput label="Calories" onChangeText={text => this.setState({ food_cal: text })} />
                            <TextInput label="Protein" onChangeText={text => this.setState({ food_pro: text })} />
                            <TextInput label="Carbohydrates" onChangeText={text => this.setState({ food_carb: text })} />
                            <TextInput label="Fat" onChangeText={text => this.setState({ food_fat: text })} />
                            {/* {<Button mode="contained" onPress={() => this.onAddFood()}>
                        <Text> Add Food </Text>
                    </Button>
                    } */}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onAddFood()}>
                                <Text style={styles.buttonText}>Add Food</Text>
                            </TouchableOpacity>}
                            {/* {<Button mode="contained" onPress={() => this.switchToFoods()}>
                        <Text> Back to Food List </Text>
                    </Button> */}
                            }
                    {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.switchToFoods()}>
                                <Text style={styles.buttonText}>Back to Food List</Text>
                            </TouchableOpacity>}
                            {/* {<Button mode="contained" onPress={() => this.switchToSummary()}>
                        <Text> Back to Summary </Text>
                    </Button>
                    } */}
                            {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                                <Text style={styles.buttonText}>Back to Summary</Text>
                            </TouchableOpacity>}
                        </View>
                    </ScrollView >
                </KeyboardAvoidingView >
            )

        }
        if (this.state.mode === 'addCT') {
            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <View>
                            <Text style={styles.text} > Add New Activity </Text>
                            <List.Item title="Activity Name"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_name: text })} />
                            <List.Item title="Activity Duration"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_dur: text })} />
                            <List.Item title="Activity Date"></List.Item>
                            {<Button mode="text" >
                                <Text> Using Current time </Text>
                            </Button>
                            }
                            <List.Item title="Activity Calories"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_cal: text })} />
                        </View>

                        {/* { <Button mode="contained" onPress={() => this.onAdd()}>
                    <Text> Add Activity </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onAdd()}>
                            <Text style={styles.buttonText}>Add Activity</Text>
                        </TouchableOpacity>}
                        {/* { <Button mode="contained" onPress={() => this.switchToSummary()}>
                    <Text> Back to Summary </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                            <Text style={styles.buttonText}>Back to Summary</Text>
                        </TouchableOpacity>}
                    </ScrollView>
                </KeyboardAvoidingView>

            )
        }
        if (this.state.mode === 'add') {

            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <View>
                            <Text style={styles.text} > Add New Activity </Text>
                            <List.Item title="Activity Name"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_name: text })} />
                            <List.Item title="Activity Duration"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_dur: text })} />
                            <List.Item title="Activity Date"></List.Item>
                            {<Button mode="text" onPress={() => this.switchToActCT()}>
                                <Text> Use Current time </Text>
                            </Button>
                            }
                            <TextInput onChangeText={text => this.setState({ act_date: text })} />
                            <List.Item title="Activity Calories"></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_cal: text })} />
                        </View>

                        {/* { <Button mode="contained" onPress={() => this.onAdd()}>
                    <Text> Add Activity </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainerSign} onPress={() => this.onAdd()}>
                            <Text style={styles.buttonText}>Add Activity</Text>
                        </TouchableOpacity>}
                        {/* { <Button mode="contained" onPress={() => this.switchToSummary()}>
                    <Text> Back to Summary </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                            <Text style={styles.buttonText}>Back to Summary</Text>
                        </TouchableOpacity>}
                    </ScrollView>
                </KeyboardAvoidingView>

            )

        }
        if (this.state.mode === 'act_edit') {

            return (
                <KeyboardAvoidingView >
                    <ScrollView >
                        <View>
                            <Text style={styles.text} > Edit Activity </Text>
                            <Text > All fields must be complete</Text>
                            <List.Item title="Activity Name" description={this.state.activities[this.state.act_key].name}></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_name: text })} />
                            <List.Item title="Activity Duration" description={this.state.activities[this.state.act_key].duration}></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_dur: text })} />
                            <List.Item title="Activity Date" description={this.state.activities[this.state.act_key].date}></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_date: text })} />
                            <List.Item title="Activity Calories" description={this.state.activities[this.state.act_key].calories}></List.Item>
                            <TextInput onChangeText={text => this.setState({ act_cal: text })} />
                        </View>

                        {/* { <Button mode="contained" onPress={() => this.onActEdit(this.state.activities[this.state.act_key].id, this.state.act_name, this.state.act_dur, this.state.act_cal)}>
                    <Text> Update Activity </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onActEdit(this.state.activities[this.state.act_key].id, this.state.act_name, this.state.act_dur, this.state.act_cal)}>
                            <Text style={styles.buttonText}>Update Activity</Text>
                        </TouchableOpacity>}
                        {/* { <Button mode="contained" onPress={() => this.onActDelete(this.state.activities[this.state.act_key].id)}>
                    <Text> Delete Activity </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.onActDelete(this.state.activities[this.state.act_key].id)}>
                            <Text style={styles.buttonText}>Delete Activity</Text>
                        </TouchableOpacity>}
                        {/* { <Button mode="contained" onPress={() => this.switchToSummary()}>
                    <Text> Back to Summary </Text>
                </Button> 
             } */}
                        {<TouchableOpacity style={styles.buttonContainer} onPress={() => this.switchToSummary()}>
                            <Text style={styles.buttonText}>Back to Summary</Text>
                        </TouchableOpacity>}
                    </ScrollView>
                </KeyboardAvoidingView>

            )

        }
    } // end of render

}
// define your styles
const styles = StyleSheet.create({
    button: {
        height: 100,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    buttonContainerSign: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 100,
        backgroundColor: '#e08d3c',
        paddingVertical: 15
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 100,
        backgroundColor: '#8b0000',
        paddingVertical: 15
    },
    buttonText: {
        fontSize: 30,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        width: '60%',
        backgroundColor: 'darkred',
        justifyContent: 'center',
        alignItems: 'center',

    },
    header: {
        // backgroundColor:  '#008b8b',
        // width: '100%'

        // flex: 0.2
    },
    container: {
        width: '100%',
        //  height: 330,
        alignItems: 'center',
        padding: 20,
    },
    goals: {
        padding: 10,
    },
    text: {
        padding: 10,
        fontSize: 30,
    },
    item: {
        fontSize: 20,
    }
});

export default Profile;
