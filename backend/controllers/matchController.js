const User = require("../models/User");
const Room = require("../models/Room");

import dotenv from 'dotenv';

dotenv.config();


// Function to execute code using the compiler API
async function executeCode(script, language, stdin) {

    const execution_data = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        script: script,
        language: language,
        stdin: stdin,
        versionIndex: "0"
    };

    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: 'POST',
            body: JSON.stringify(execution_data),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        return data.output.trim(); // Trim the output to remove extra spaces and newlines
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Execution failed');
    }
}

exports.getProblemID = async (req, res) => {
    try {
        const { userID } = req.query;
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const problemID=user.problemID;
        res.status(200).json({ problemID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitCode = async (req, res) => {
    try {
        const { script, language, userID, problemID } = req.body;
        
        let passedTestcases = 0;
        let totalTestcases = 0;
        
        // Fetch test case headers
        const headerResponse = await fetch(`https://judgedat.u-aizu.ac.jp/testcases/${problemID}/header`);
        const headerData = await headerResponse.json();
        const headers = headerData.headers;
        
        // Iterate over test case headers
        for (const header of headers) {
            const serial = header.serial;
            totalTestcases++;
            
            // Fetch test case data
            const testCaseResponse = await fetch(`https://judgedat.u-aizu.ac.jp/testcases/${problemID}/${serial}`);
            const testCaseData = await testCaseResponse.json();
            const input = testCaseData.in.trim(); // Trim input to remove extra spaces and newlines
            const expectedOutput = testCaseData.out.trim(); // Trim expected output
            
            // Execute the code with current test case input
            try {
                const actualOutput = await executeCode(script, language, input);
                // Compare actual output with expected output
                if (actualOutput === expectedOutput) {
                    passedTestcases++;
                }
            } catch (error) {
                console.error('Error executing code:', error);
                // Handle execution errors, maybe mark the test case as failed
            }
        }
        
        const user = await User.findOne({ _id:userID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.numberOfTestsPassed = passedTestcases;
        user.submissionTime = new Date();
        
        await user.save();

        res.status(200).json({ passedTestcases, totalTestcases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function findResult(array) {
    let players = [];

    for (let i = 0; i < array.length; i += 2) {
        const ID1 = array[i].id;
        const user1 = await User.findOne({ _id: ID1 });
        const t1 = user1.numberOfTestsPassed;
        const s1 = user1.submissionTime;

        if (i === array.length - 1) {
            // Single player case
            if (t1 > 0) {
                players.push(array[i]);
            }
        } else {
            const ID2 = array[i + 1].id;
            const user2 = await User.findOne({ _id: ID2 });
            const t2 = user2.numberOfTestsPassed;
            const s2 = user2.submissionTime;
            
            if (s1 === null && s2 !== null) {
                players.push(array[i + 1]);
            } else if (s1 !== null && s2 === null) {
                players.push(array[i]);
            } else if (s1 === null && s2 === null) {
                players.push(array[i]);
            } else {
                if (t1 > t2) {
                    players.push(array[i]);
                } else if (t1 < t2) {
                    players.push(array[i + 1]);
                } else {
                    if (s1 < s2) {
                        players.push(array[i]);
                    } else {
                        players.push(array[i + 1]);
                    }
                }
            }
        }
    }
    return players;
}

exports.calculateResult = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const check=room.resultCalculated;
        if(check){
            res.status(200).json({ message: 'Results calculated'});
        }else{

            const players = room.players;
            room.oldPlayers=players;
            const newPlayers = await findResult(players);
            room.players=newPlayers;
            room.resultCalculated=true;
            room.roundStarted=false;
            
            await room.save();
    
            res.status(200).json({ message: 'Results calculated'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};