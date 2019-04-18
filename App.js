import React from 'react';
import ApolloClient  from 'apollo-boost';
import gql from 'graphql-tag';
import SparkButton from 'react-native-sparkbutton';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions} from 'react-native';

const client = new ApolloClient({
  uri: 'https://www.graphqlhub.com/graphql',
  onError: (e) => { console.log(e) }
})

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



_ratingCompleted(){
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




_randomGIF(){
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
  console.log(data.data.giphy.random.images.original.url);
  this.setState({URL : data.data.giphy.random.images.original.url});
  console.log("this.state.URL : : : "+this.state.URL)
  this.setState({ID: data.data.giphy.random.id});
})
.catch(error => console.error(error));
}




_searchKeyValueID(){
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
    id: String(this.state.ID)
  }
  })
  .then(data => {
    console.log("_searchKeyValueID: " + this.state.ID);
    if(data.data.keyValue.getValue.key!=null || data.data.keyValue.getValue.value==='liked'){
      console.log('This GIF has reoccured');
      this.setState({checked : true});
    }
    }
  )
  .catch(error => {
    console.error(error);
    console.log(this.state.ID)
  });

}



_NewGiphyy(){
  if(this.state.checked){this.setState({checked : false})}
  console.log("should be false : " + this.state.checked)
  this._randomGIF();
  this._searchKeyValueID();
}






  render() {
    
    const { checked } = this.state;
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
