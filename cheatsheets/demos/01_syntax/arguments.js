var numArgs = WScript.arguments.length;
for (var i = 0; i < WScript.arguments.length; i++) {
	WScript.StdOut.Write('Hello ' + WScript.arguments(i) + '\n');
}
