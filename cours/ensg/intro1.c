#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int n = 0;
  
  bool wait = true;

  thread th1(
    [&n,&wait]() { while (wait) {} for (int i = 0; i < 1000000 ; i++) {n = n + 1;} }
  );
  thread th2(
    [&n,&wait]() { while (wait) {} for (int i = 0; i < 1000000 ; i++) {n = n + 1;} }
  );
  
  wait = false;

  th1.join();
  th2.join();

  cerr << "n = " << n << endl;

  return 0;
}

// ----------------------------------------------------------
