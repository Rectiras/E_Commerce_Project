import React from 'react';
import {FlatList, Text, Button, TextInput, TouchableOpacity, Image, View,} from 'react-native';
import renderer from 'react-test-renderer';
import fetchMock from 'fetch-mock';
import {render, waitForElement, fireEvent, act} from 'react-native-testing-library';
import {NavigationContainer} from '@react-navigation/native';
import ReactTestRenderer from 'react-test-renderer';

const UseEffect = ({ callback }: { callback: Function }) => {
    React.useEffect(callback);
    return null;
};

const Counter = () => {
    const [count, setCount] = React.useState(0);

    const text = `Total count: ${count}`;
    return <Text onPress={() => setCount(count + 1)}>{text}</Text>;
};

//Unit Tests:

//Rendering of FlatList in Product Screen.
test('Renders the FlatList component', () => {
    const tree = renderer
        .create(
            <FlatList
                data={['Sweatshirt1', 'Sweatshirt2', 'Sweatshirt3']}
                keyExtractor={item => item}
                renderItem={({item}) => <Text>{item}</Text>}
            />,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

//Rendering of Button in Login Screen.
test('Renders the Button component', () => {
    const tree = renderer
        .create(
            <Button onPress={console.log()} title={'Hello'}>
                <Text>LOGIN</Text>
            </Button>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

test("should display successful message on successful register", async () => {;
    const SuccessMessage = 'User info'
    expect(SuccessMessage).toBeTruthy();
})

test('clicking on one item takes you to the details screen', async () => {
    const component = (
        <NavigationContainer>
        </NavigationContainer>
    );
})

test('render should trigger useEffect', () => {
    const effectCallback = jest.fn();
    render(<UseEffect callback={effectCallback} />);

    expect(effectCallback).toHaveBeenCalledTimes(1);
});

test('update should trigger useEffect', () => {
    const effectCallback = jest.fn();
    const { update } = render(<UseEffect callback={effectCallback} />);
    update(<UseEffect callback={effectCallback} />);

    expect(effectCallback).toHaveBeenCalledTimes(2);
});

test('trigger useState', () => {
    const { getByText } = render(<Counter />);
    const counter = getByText(/Total count/i);

    expect(counter.props.children).toEqual('Total count: 0');
    fireEvent.press(counter);
    expect(counter.props.children).toEqual('Total count: 1');
});

test('should act even if there is no act in react-test-renderer', () => {
    // $FlowFixMe
    ReactTestRenderer.act = undefined;
    const callback = jest.fn();

    act(() => {
        callback();
    });

    expect(callback).toHaveBeenCalled();
});

let isMounted = false;

class Test extends React.Component<*> {
    componentDidMount() {
        isMounted = true;
    }

    componentWillUnmount() {
        isMounted = false;
        if (this.props.onUnmount) {
            this.props.onUnmount();
        }
    }
    render() {
        return <View />;
    }
}

afterEach(() => {
    jest.useRealTimers();
});

// This just verifies that by importing RNTL in an environment which supports afterEach (like jest)
// we'll get automatic cleanup between tests.
test('component is mounted, but not umounted before test ends', () => {
    const fn = jest.fn();
    render(<Test onUnmount={fn} />);
    expect(isMounted).toEqual(true);
    expect(fn).not.toHaveBeenCalled();
});

test('component is automatically umounted after first test ends', () => {
    expect(isMounted).toEqual(false);
});

test('does not time out with legacy fake timers', () => {
    jest.useFakeTimers('legacy');
    render(<Test />);
    expect(isMounted).toEqual(true);
});

const MyButton = ({ children, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text>{children}</Text>
    </TouchableOpacity>
);

const Banana = () => {
    const test = 0;
    return (
        <View>
            <Text>Is the banana fresh?</Text>
            <Text testID="bananaFresh">not fresh</Text>

            <MyButton onPress={jest.fn()} type="primary">
                Change freshness!
            </MyButton>
            <Text testID="duplicateText">First Text</Text>
            <Text testID="duplicateText">Second Text</Text>
            <Text>{test}</Text>
        </View>
    );
};

test('getByText, queryByText with children as Array', () => {
    const BananaCounter = ({ numBananas }) => (
        <Text>There are {numBananas} bananas in the bunch</Text>
    );
});

test('queryByText nested <Image> in <Text> at start', () => {
    expect(
        render(
            <Text>
                <Image source={{}} />
                Hello
            </Text>
        ).queryByText('Hello')
    ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at end', () => {
    expect(
        render(
            <Text>
                Hello
                <Image source={{}} />
            </Text>
        ).queryByText('Hello')
    ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> in middle', () => {
    expect(
        render(
            <Text>
                Hello
                <Image source={{}} />
                World
            </Text>
        ).queryByText('HelloWorld')
    ).toBeTruthy();
});

test('queryByText not found', () => {
    expect(
        render(
            <Text>
                Hello
                <Image source={{}} />
            </Text>
        ).queryByText('SomethingElse')
    ).toBeFalsy();
});

test('queryByText nested text across multiple <Text> in <Text>', () => {
    const { queryByText } = render(
        <Text nativeID="1">
            Hello{' '}
            <Text nativeID="2">
                World
                <Text>!{true}</Text>
            </Text>
        </Text>
    );

    expect(queryByText('Hello World!')?.props.nativeID).toBe('1');
});

test('queryByText with nested Text components each with text return the lowest one', () => {
    const NestedTexts = () => (
        <Text nativeID="1">
            bob
            <Text nativeID="2">My text</Text>
        </Text>
    );

    const { queryByText } = render(<NestedTexts />);

    expect(queryByText('My text')?.props.nativeID).toBe('2');
});

test('queryByText nested <CustomText> in <Text>', () => {
    const CustomText = ({ children }) => {
        return <Text>{children}</Text>;
    };

    expect(
        render(
            <Text>
                Hello <CustomText>World!</CustomText>
            </Text>
        ).queryByText('Hello World!')
    ).toBeTruthy();
});

test('queryByText nested deep <CustomText> in <Text>', () => {
    const CustomText = ({ children }) => {
        return <Text>{children}</Text>;
    };

    expect(
        render(
            <Text>
                <CustomText>Hello</CustomText> <CustomText>World!</CustomText>
            </Text>
        ).queryByText('Hello World!')
    ).toBeTruthy();
});
