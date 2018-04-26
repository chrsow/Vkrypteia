import React, { PureComponent } from 'react';
import { 
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  PixelRatio 
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
// import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from 'react-navigation/src/views/TabView/TabBarIcon';
import Touchable from 'react-native-platform-touchable';
import { Colors } from '../components/Common';
import TabNavigator from 'react-native-tab-navigator';

// import { Navigator } from "react-native-deprecated-custom-components";

type DefaultProps = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  showLabel: boolean,
};

type Props = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  position: Animated.Value,
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: TabScene) => ?(React.Element<*> | string),
  renderIcon: (scene: TabScene) => React.Element<*>,
  onPressTab: Function,
  showLabel: boolean,
  style?: Style,
  labelStyle?: Style,
  tabStyle?: Style,
  showIcon: boolean,
};

const styles = StyleSheet.create({
  tabBarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    backgroundColor: '#f4f4f4', // Default background color in iOS 10
  },
  tabBar: {
    height: 49, // Default tab bar height in iOS 10
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  icon: {
    flexGrow: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});


class TabBarBottom extends PureComponent<DefaultProps, Props, void>{
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
  };

  props: Props;

  onPress = index => {
    const { jumpToIndex, navigation } = this.props;
    const previousIndex = navigation.state.index;

    if (this.props.onPressTab) {
      this.props.onPressTab(index, previousIndex, navigation, () => jumpToIndex(index));
    } else {
      jumpToIndex(index);
    }
  }

  renderLabel = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map(
      (inputIndex: number) => (inputIndex === index ? activeTintColor : inactiveTintColor)
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ ...scene, tintColor });
    if (typeof label === 'string') {
      return <Animated.Text style={[styles.label, { color }, labelStyle]}>{label}</Animated.Text>;
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor });
    }

    return label;
  }

  renderIcon = (scene: TabScene)=>{
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  }

  render(){
    const {
      position,
      navigation,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      tabStyle,
    } = this.props;

    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    return (
      <SafeAreaView style={[styles.tabBarContainer, style]} forceInset={{ bottom: 'always' }}>
        <Animated.View style={styles.tabBar}>
          {routes.map((route: NavigationRoute, index: number) => {
            const focused = index === navigation.state.index;
            const scene = { route, index, focused };
            const outputRange = inputRange.map(
              (inputIndex: number) =>
                inputIndex === index ? activeBackgroundColor : inactiveBackgroundColor
            );
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange,
            });
            const justifyContent = this.props.showIcon ? 'flex-end' : 'center';
            return (
              <Touchable
                fallback={TouchableWithoutFeedback}
                background={Touchable.Ripple(Colors.tabIconSelected, true)}
                style={styles.tab}
                key={route.key}
                onLongPress={() => this.onPress(index)}
                onPress={() => this.onPress(index)}>
                <Animated.View style={[styles.tab, { backgroundColor, justifyContent }, tabStyle]}>
                  {this.renderIcon(scene)}
                  {this.renderLabel(scene)}
                </Animated.View>
              </Touchable>
            );
          })}
        </Animated.View>
      </SafeAreaView>
    );
    // return(
  
    //   <TabNavigator tabBarStyle={styles.tabBar}>
    //     <TabNavigator.Item
    //       title="Vote"
    //       titleStyle={styles.tabTitle}
    //       selectedTitleStyle={styles.tabTitleActive}
    //       selected={this.props.tab === "vote"}
    //       // onPress={this.onTabSelect.bind(this, "schedule")}
    //       renderIcon={ _ => 
    //         <Ionicons name="md-checkmark-circle" size={32} color="green" />
    //         // this.renderTabIcon(require(''))
    //       }
    //       renderSelectedIcon={ _ => 
    //         // this.renderTabIcon(require(''))
    //         <Ionicons name="md-checkmark-circle" size={32} color="green" />
    //       }
    //     >
    //       <VotingScreen/>
    //       {/* <View><Text>eieiei</Text></View> */}
    //     </TabNavigator.Item>
    //     <TabNavigator.Item
    //       title='Vote'
    //       titleStyle={styles.tabTitle}
    //     >
    //       Eiei
    //     </TabNavigator.Item>
    //     <TabNavigator.Item
    //       title='Profile'
    //       titleStyle={styles.tabTitle}
    //       renderIcon={_=>{}}
    //     >
    //       Eiei
    //     </TabNavigator.Item>
    //   </TabNavigator>
    // );
    
  }
}

export default TabBarBottom;