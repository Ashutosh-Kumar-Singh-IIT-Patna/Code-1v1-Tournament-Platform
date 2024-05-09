const User = require("../models/User");

// Function to execute code using the compiler API
async function executeCode(script, language, stdin) {
    const CLIENT_ID = "1f31295b368778686392d97287021531";
    const CLIENT_SECRET = "1cd6eadce07ee7bdb51f6b72de180c8c2fdb33630746959ba5f5143ef2d75cb6";

    const execution_data = {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
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