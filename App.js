import React from 'react';
import ApolloClient  from 'apollo-boost';
import gql from 'graphql-tag';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions} from 'react-native';



export default class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      URL: 'placeholder',
      ID: 'placeholder',
      checked: false
    };
    this._randomGIF = this._randomGIF.bind(this);
    this._searchKeyValueID = this._searchKeyValueID.bind(this);
    this._NewGiphyy = this._NewGiphyy.bind(this);
    this._ratingCompleted = this._ratingCompleted.bind(this);
  }
  
 componentWillMount(){
   this._randomGIF();
 }


/*Function to update the ID and value for 'liked' GIFs into GraphQLHubs KeyValueAPI.
This is used to mutate the state with ID and corresponding value*/
 _ratingCompleted(){
   const client = new ApolloClient({
     uri: 'https://www.graphqlhub.com/graphql',
     onError: (e) => { console.log(e) }
   })
   const mutation1 = gql`
   mutation GraphQLHubMutationAPI($id : String!) {
     keyValue_setValue(input: {
       clientMutationId: "mobile", id: $id, value: "liked" 
      }) {
       item {
        value
        id
       }
       clientMutationId
     }
    }
 `
 client.mutate({
   mutation: mutation1,
   variables :{
     id: String(this.state.ID),
   }
   })
   .then(data => {console.log( data);  
     this.setState({checked : true});})
   .catch(error => {
     console.error(error);
   });  
 }



/*Function to query to GraphQLHub's Giphy API to fetch data about random GIF to be displayed*/
_randomGIF(){
  const client = new ApolloClient({
    uri: 'https://www.graphqlhub.com/graphql',
    onError: (e) => { console.log(e) }
  })
client.query({
query: gql`
{
  graphQLHub
  giphy {
		random(tag:"javascript") {
    	id
      url
      images {
        original {
          url
        }
      }
  	}
  }
}
`
})
.then(data => {
  this.setState({URL : data.data.giphy.random.images.original.url});
  this.setState({ID: data.data.giphy.random.id});
})
.catch(error => console.error(error));
}


/*Function to search fir the ID and value for 'liked' GIFs into GraphQLHubs KeyValueAPI.
This is useful to determine if this GIF has been repeated, if so, was it liked, and if it was liked to retain the 'like'*/
 _searchKeyValueID(){
   const client = new ApolloClient({
     uri: 'https://www.graphqlhub.com/graphql',
     onError: (e) => { console.log(e) }
   })
   const query1 = gql`
 query GraphQLHubAPI ($id : String!) {
   keyValue {
     getValue(id: $id) {
       id
       value
     }
   }
 }
 `
 client.query({
   query: query1,
   variables :{
     id: this.state.ID
   }
   })
   .then(data => {
     if(data.data.keyValue.getValue.key!=null || data.data.keyValue.getValue.value==='liked'){
       this.setState({checked : true});
       console.log("GIF has reoccurred")
     }
     }
   )
   .catch(error => {
     console.error(error);
   });

 }


/*Function to Handle the button click for a New GIF. Initiates functions for generating a random GIF*/
_NewGiphyy(){
 if(this.state.checked){this.setState({checked : false})}
    this._randomGIF();
    this._searchKeyValueID();
}


  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 3, flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/3, backgroundColor: 'black', resizeMode:'contain'}} source={{uri : this.state.URL}} />
        </View>
         <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', paddingRight:'15%'}}>
        <TouchableOpacity onPress={ this._ratingCompleted }>
              <Image
                style={{height: 30, width: 30}}
                source={
                    this.state.checked
                    ? require('../GiphyApp/assets/icons8-star-filled-48.png')
                    : require('../GiphyApp/assets/icons8-star-empty-50.png')
                }
              />
            </TouchableOpacity>
        </View> 
        <View style={{flex: 3, flexDirection: 'column', justifyContent: 'space-around'}}>
          <TouchableOpacity
              style={{
                width: 100,
                height: 100,
                borderRadius: 100/2,
                backgroundColor: '#DC6466',
                justifyContent: 'center',
                alignSelf:'center'
              }}
              activeOpacity = { .5 }
              onPress={ this._NewGiphyy }>
            <Text style={{alignSelf: 'center', color:'white'}}> Re-Roll </Text>      
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent: 'space-around',
  },
});
