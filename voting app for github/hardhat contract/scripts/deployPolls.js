async function main() {
    const Voting = await ethers.getContractFactory("VotingPolls");

    // Start deployment, returning a promise that resolves to a contract object
    const Voting_ = await Voting.deploy(90);
    console.log("Contract address:", Voting_.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
